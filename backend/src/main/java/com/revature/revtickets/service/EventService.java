package com.revature.revtickets.service;

import com.revature.revtickets.dto.EventDTO;
import com.revature.revtickets.entity.Event;
import com.revature.revtickets.exception.ResourceNotFoundException;
import com.revature.revtickets.repository.EventRepository;
import com.revature.revtickets.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    public List<Event> getAllActiveEvents() {
        return eventRepository.findByIsActiveTrue();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategoryAndIsActiveTrue(category);
    }

    public List<Event> getUpcomingEvents() {
        LocalDate today = LocalDate.now();
        List<Event> upcomingEvents = eventRepository.findByEventDateGreaterThanEqualAndIsActiveTrue(today);
        System.out.println("Found " + upcomingEvents.size() + " upcoming events from " + today + " onwards (inclusive)");
        return upcomingEvents;
    }

    public Event createEvent(EventDTO dto, MultipartFile displayImage, MultipartFile bannerImage) throws IOException {
        Event event = new Event();
        mapDTOToEntity(dto, event);

        if (displayImage != null && !displayImage.isEmpty()) {
            String imageUrl = fileUploadUtil.uploadFile(displayImage, "display");
            event.setDisplayImageUrl(imageUrl);
        }

        if (bannerImage != null && !bannerImage.isEmpty()) {
            String bannerUrl = fileUploadUtil.uploadFile(bannerImage, "banner");
            event.setBannerImageUrl(bannerUrl);
        }

        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, EventDTO dto, MultipartFile displayImage, MultipartFile bannerImage) throws IOException {
        Event event = getEventById(id);
        mapDTOToEntity(dto, event);

        if (displayImage != null && !displayImage.isEmpty()) {
            if (event.getDisplayImageUrl() != null) {
                fileUploadUtil.deleteFile(event.getDisplayImageUrl());
            }
            String imageUrl = fileUploadUtil.uploadFile(displayImage, "display");
            event.setDisplayImageUrl(imageUrl);
        }

        if (bannerImage != null && !bannerImage.isEmpty()) {
            if (event.getBannerImageUrl() != null) {
                fileUploadUtil.deleteFile(event.getBannerImageUrl());
            }
            String bannerUrl = fileUploadUtil.uploadFile(bannerImage, "banner");
            event.setBannerImageUrl(bannerUrl);
        }

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        event.setIsActive(false);
        eventRepository.save(event);
    }

    private void mapDTOToEntity(EventDTO dto, Event event) {
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setCategory(dto.getCategory());
        event.setEventDate(dto.getEventDate());
        event.setEventTime(dto.getEventTime());
        event.setDurationMinutes(dto.getDurationMinutes());
        event.setArtistOrTeam(dto.getArtistOrTeam());
        event.setLanguage(dto.getLanguage());
        event.setAgeRestriction(dto.getAgeRestriction());
        event.setTrailerUrl(dto.getTrailerUrl());
    }
}
