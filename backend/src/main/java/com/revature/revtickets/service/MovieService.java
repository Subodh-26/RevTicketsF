package com.revature.revtickets.service;

import com.revature.revtickets.dto.MovieDTO;
import com.revature.revtickets.entity.Movie;
import com.revature.revtickets.exception.ResourceNotFoundException;
import com.revature.revtickets.repository.MovieRepository;
import com.revature.revtickets.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    public List<Movie> getAllActiveMovies() {
        return movieRepository.findByIsActiveTrue();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
    }

    public List<Movie> searchMovies(String title) {
        return movieRepository.findByTitleContainingIgnoreCaseAndIsActiveTrue(title);
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenreContainingIgnoreCaseAndIsActiveTrue(genre);
    }

    public List<Movie> getMoviesByLanguage(String language) {
        return movieRepository.findByLanguageAndIsActiveTrue(language);
    }

    public List<Movie> getNowShowingMovies() {
        return movieRepository.findNowShowingMovies();
    }

    public List<Movie> getComingSoonMovies() {
        return movieRepository.findComingSoonMovies();
    }

    public Movie createMovie(MovieDTO dto, MultipartFile displayImage, MultipartFile bannerImage) throws IOException {
        Movie movie = new Movie();
        mapDTOToEntity(dto, movie);

        if (displayImage != null && !displayImage.isEmpty()) {
            String imageUrl = fileUploadUtil.uploadFile(displayImage, "display");
            movie.setDisplayImageUrl(imageUrl);
        }

        if (bannerImage != null && !bannerImage.isEmpty()) {
            String bannerUrl = fileUploadUtil.uploadFile(bannerImage, "banner");
            movie.setBannerImageUrl(bannerUrl);
        }

        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, MovieDTO dto, MultipartFile displayImage, MultipartFile bannerImage) throws IOException {
        Movie movie = getMovieById(id);
        mapDTOToEntity(dto, movie);

        if (displayImage != null && !displayImage.isEmpty()) {
            if (movie.getDisplayImageUrl() != null) {
                fileUploadUtil.deleteFile(movie.getDisplayImageUrl());
            }
            String imageUrl = fileUploadUtil.uploadFile(displayImage, "display");
            movie.setDisplayImageUrl(imageUrl);
        }

        if (bannerImage != null && !bannerImage.isEmpty()) {
            if (movie.getBannerImageUrl() != null) {
                fileUploadUtil.deleteFile(movie.getBannerImageUrl());
            }
            String bannerUrl = fileUploadUtil.uploadFile(bannerImage, "banner");
            movie.setBannerImageUrl(bannerUrl);
        }

        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        try {
            Movie movie = getMovieById(id);
            
            // Delete associated image files
            if (movie.getDisplayImageUrl() != null) {
                fileUploadUtil.deleteFile(movie.getDisplayImageUrl());
            }
            if (movie.getBannerImageUrl() != null) {
                fileUploadUtil.deleteFile(movie.getBannerImageUrl());
            }
            
            // Actually delete the record from database
            movieRepository.delete(movie);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete movie files: " + e.getMessage(), e);
        }
    }

    private void mapDTOToEntity(MovieDTO dto, Movie movie) {
        movie.setTitle(dto.getTitle());
        movie.setDescription(dto.getDescription());
        movie.setDurationMinutes(dto.getDurationMinutes());
        movie.setGenre(dto.getGenre());
        movie.setLanguage(dto.getLanguage());
        movie.setParentalRating(dto.getParentalRating());
        movie.setReleaseDate(dto.getReleaseDate());
        movie.setCast(dto.getCast());
        movie.setCrew(dto.getCrew());
        movie.setTrailerUrl(dto.getTrailerUrl());
        if (dto.getRating() != null) {
            movie.setRating(dto.getRating());
        }
    }
}
