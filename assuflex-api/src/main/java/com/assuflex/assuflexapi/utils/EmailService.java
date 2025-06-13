package com.assuflex.assuflexapi.utils;

import com.assuflex.assuflexapi.model.Users;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;


@Async
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private final TemplateEngine templateEngine;

    public void sendRegistrationEmail(Users user) throws MessagingException {

        String subject = "Inscription réussie";
        Context context = new Context();
        context.setVariable("firstName", user.getEmail());
        context.setVariable("lastName", user.getName());

        String htmlContent = templateEngine.process("registration-email", context);

        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    public void sendValidationEmail(Users user) throws MessagingException {
        String subject = "Validation de votre compte";

        Context context = new Context();
        context.setVariable("firstName", user.getName());

        String htmlContent = templateEngine.process("validation-email", context);

        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }


    public void sendPasswordResetEmail(Users user, String resetToken) throws MessagingException {
        String subject = "Réinitialisation de votre mot de passe";

        Context context = new Context();
        context.setVariable("firstName", user.getName());

        String resetPasswordUrl = "http://localhost:4200/reset-password?token=" + resetToken;
        context.setVariable("resetPasswordUrl", resetPasswordUrl);

        String htmlContent = templateEngine.process("password-reset-email", context);

        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String attachmentName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);
        helper.addAttachment(attachmentName, new ByteArrayResource(attachment));
        mailSender.send(message);
    }

    public void sendPlanRejectedEmail(Users user) throws MessagingException {
        String subject = "Votre demande de contrat a été rejetée";

        Context context = new Context();
        context.setVariable("firstName", user.getName());

        String htmlContent = templateEngine.process("plan-rejected-email", context);
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    public void sendPlanAcceptedEmail(Users user, String checkoutUrl) throws MessagingException {
        String subject = "Votre plan AssuFlex a été accepté !";
        Context context = new Context();
        context.setVariable("firstName", user.getName());
        context.setVariable("checkoutUrl", checkoutUrl);

        String htmlContent = templateEngine.process("plan-accepted-email", context);
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }



    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

}
