package com.campusdual.cd2024bfs3g1.model.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utils {

    public static Boolean validaEmail (String email) {
        Pattern pattern = Pattern.compile("^([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$");
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public static String getRole(){
        if(SecurityContextHolder.getContext() == null) {
            return null;
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth == null || auth.getAuthorities() == null || auth.getAuthorities().toArray().length == 0) {
            return null;
        }
        return auth.getAuthorities().toArray()[0].toString();
    }
}
