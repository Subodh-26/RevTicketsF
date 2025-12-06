package com.revature.revtickets.service;

import com.revature.revtickets.entity.Banner;
import com.revature.revtickets.exception.ResourceNotFoundException;
import com.revature.revtickets.repository.BannerRepository;
import com.revature.revtickets.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
public class BannerService {

    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    public List<Banner> getAllActiveBanners() {
        return bannerRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    public Banner getBannerById(Long id) {
        return bannerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));
    }

    public Banner createBanner(Banner banner, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = fileUploadUtil.uploadFile(imageFile, "banner");
            banner.setBannerImageUrl(imageUrl);
        }
        return bannerRepository.save(banner);
    }

    public Banner updateBanner(Long id, Banner bannerDetails, MultipartFile imageFile) throws IOException {
        Banner banner = getBannerById(id);
        
        banner.setTitle(bannerDetails.getTitle());
        banner.setSubtitle(bannerDetails.getSubtitle());
        banner.setLinkUrl(bannerDetails.getLinkUrl());
        banner.setDisplayOrder(bannerDetails.getDisplayOrder());

        if (imageFile != null && !imageFile.isEmpty()) {
            if (banner.getBannerImageUrl() != null) {
                fileUploadUtil.deleteFile(banner.getBannerImageUrl());
            }
            String imageUrl = fileUploadUtil.uploadFile(imageFile, "banner");
            banner.setBannerImageUrl(imageUrl);
        }

        return bannerRepository.save(banner);
    }

    public void deleteBanner(Long id) {
        Banner banner = getBannerById(id);
        banner.setIsActive(false);
        bannerRepository.save(banner);
    }

    public void updateBannerOrder(Long id, Integer displayOrder) {
        Banner banner = getBannerById(id);
        banner.setDisplayOrder(displayOrder);
        bannerRepository.save(banner);
    }
}
