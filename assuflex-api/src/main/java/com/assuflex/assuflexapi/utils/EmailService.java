package com.assuflex.assuflexapi.utils;

import com.assuflex.assuflexapi.DTO.QuoteRequest;
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

import java.time.format.DateTimeFormatter;


@Async
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private final TemplateEngine templateEngine;

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

        String resetPasswordUrl = "http://localhost:5173/reset-password?token=" + resetToken;
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

    public void sendQuoteToTeamHtml(QuoteRequest request) throws MessagingException {
        String subject = "Nouvelle demande de devis santé/prévoyance";

        String htmlContent = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #FF6600;">📩 Nouvelle demande de devis soumise via le site web</h2>

            <p><strong>Nom :</strong> %s %s<br/>
            <strong>Date de naissance :</strong> %s<br/>
            <strong>Email :</strong> %s<br/>
            <strong>Téléphone :</strong> %s<br/>
            <strong>Code postal :</strong> %s</p>

            <p><strong>Situation :</strong> %s<br/>
            <strong>Régime :</strong> %s<br/>
            <strong>Revenu mensuel :</strong> Non renseigné</p>

            <p><strong>Nombre de bénéficiaires :</strong> %d<br/>
            <strong>Couverture souhaitée :</strong> %s<br/>
            <strong>Niveau de garanties :</strong></p>
            <ul>
                <li>Hospitalisation : %s%%</li>
                <li>Dentaire : %s%%</li>
                <li>Optique : %s%%</li>
                <li>Soins courants : %s%%</li>
            </ul>

            <p><strong>Urgence :</strong> Normale</p>

            <p>✅ <strong>Consentement RGPD :</strong> Oui<br/>
            ✅ <strong>Autorisation de rappel :</strong> Oui</p>

            <p style="margin-top: 20px;">👉 <strong style="color: #007BFF;">Merci de traiter cette demande rapidement.</strong></p>
        </body>
        </html>
        """,
                request.getLastName(), request.getFirstName(),
                request.getBirthDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                request.getEmail(),
                request.getPhoneNumber(),
                request.getPostalCode(),
                request.getProfession() != null ? request.getProfession() : "Non renseignée",
                request.getRegime(),
                calculateBeneficiariesCount(request),
                request.getCoverageOption(),
                request.getHospitalization(),
                request.getDental(),
                request.getOptical(),
                request.getRegularCare()
        );

        sendHtmlEmail("nidhalsaddouri33@gmail.com", subject, htmlContent);
    }


    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email HTML", e);
        }
    }

    private int calculateBeneficiariesCount(QuoteRequest request) {
        int count = 1;
        if (request.getSpouseBirthDate() != null) count++;
        if (request.getChildrenInfo() != null) count += request.getChildrenInfo().size();
        return count;
    }


}
