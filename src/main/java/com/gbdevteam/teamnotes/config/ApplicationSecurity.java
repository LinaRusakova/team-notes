package com.gbdevteam.teamnotes.config;

import com.gbdevteam.teamnotes.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity(debug = true)
@Slf4j
public class ApplicationSecurity extends WebSecurityConfigurerAdapter {

    private final UserService userService;

    //-- Uncomment the block below to disable security

//    @Override
//    public void configure(WebSecurity web) throws Exception {
//        web.ignoring().antMatchers("/**");
//    }

    //-- comment the block below to disable security

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        log.info("Dao Authentication Provider");
        http.csrf().ignoringAntMatchers("/h2-console/**");//csrf disabled for using h2-console
        http.httpBasic()
                .and()
                .headers().disable()//for h2-console frame, disable in production
                .csrf().csrfTokenRepository(csrfTokenRepository()).and()
                .authorizeRequests()
                .antMatchers("/*.js").permitAll()
                .antMatchers("/*.css").permitAll()
                .antMatchers("/promo.html").permitAll()
                .antMatchers("/h2-console/*").permitAll()
                .antMatchers("/api/v1/signup/**").permitAll()
                .anyRequest().authenticated().and()
                .formLogin()
                .and()
                .logout()
                .logoutSuccessUrl("/promo.html")
                .and()
                .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
                ;
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(userService.passwordEncoder());
        authenticationProvider.setUserDetailsService(userService);
        return authenticationProvider;
    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }
}
