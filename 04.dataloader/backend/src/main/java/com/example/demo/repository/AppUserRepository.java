package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
    public List<AppUser> findByCompanyCode(String companyCode);

    public Long countByCompanyCode(String companyCode);

    // https://github.com/spring-projects/spring-data-rest/issues/2356
    // Entity以外のクラスにマッピングさせようとするとエクセプションがでる
    @Query("SELECT u.companyCode as companyCode, COUNT(*) as count FROM AppUser u GROUP BY u.companyCode ")
    public Object[][] groupByCompanyCode();
}
