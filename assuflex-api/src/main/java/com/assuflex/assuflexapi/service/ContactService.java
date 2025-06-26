package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.ContactFormRequest;
import com.assuflex.assuflexapi.utils.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class ContactService {

    @Autowired
    private EmailService emailService;

    private static final String ADMIN_EMAIL = "nidhalsaddouri33@gmail.com";

    public void sendContactEmail(ContactFormRequest contactForm) {
        try {
            sendEmailToAdmin(contactForm);

            sendConfirmationEmailToUser(contactForm);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private void sendEmailToAdmin(ContactFormRequest contactForm) throws MessagingException {
        String subject = "📩 Nouveau message de contact AssuFlex - " +
                (contactForm.getSubject().isEmpty() ? "Demande générale" : contactForm.getSubject());

        String emailContent = buildAdminEmailContent(contactForm);

        emailService.sendHtmlEmail(ADMIN_EMAIL, subject, emailContent);
    }

    private void sendConfirmationEmailToUser(ContactFormRequest contactForm) throws MessagingException {
        String subject = "Merci pour votre message - AssuFlex a bien reçu votre demande";
        String emailContent = buildUserConfirmationEmailContent(contactForm);

        emailService.sendHtmlEmail(contactForm.getEmail(), subject, emailContent);
    }

    private String buildAdminEmailContent(ContactFormRequest contactForm) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body style=\"font-family: Arial, sans-serif; line-height: 1.6;\">");
        content.append("<h2 style=\"color: #FF6600;\">📩 Nouveau message de contact AssuFlex</h2>");
        content.append("<p style=\"color: #666;\">Un nouveau message a été soumis via le formulaire de contact du site web.</p>");
        content.append("<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");

        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Nom complet :</strong></td><td>").append(contactForm.getFullName()).append("</td></tr>");
        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Email :</strong></td><td>").append(contactForm.getEmail()).append("</td></tr>");
        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Téléphone :</strong></td><td>").append(contactForm.getPhoneNumber()).append("</td></tr>");
        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Sujet :</strong></td><td>")
                .append(contactForm.getSubject().isEmpty() ? "Demande générale" : contactForm.getSubject())
                .append("</td></tr>");
        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Message :</strong></td><td>").append(contactForm.getMessage()).append("</td></tr>");

        if (contactForm.getCallbackDateTime() != null) {
            content.append("<tr><td style='background-color: #f5f5f5;'><strong>Rappel souhaité le :</strong></td><td>")
                    .append(contactForm.getCallbackDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")))
                    .append("</td></tr>");
        }

        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Consentement RGPD :</strong></td><td>")
                .append(contactForm.isRgpd() ? "✅ Oui" : "❌ Non").append("</td></tr>");
        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Reçu le :</strong></td><td>")
                .append(contactForm.getSubmittedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm:ss")))
                .append("</td></tr>");

        content.append("</table>");
        content.append("<p style='margin-top: 20px; color: #007BFF;'><strong>👉 Merci de traiter cette demande rapidement.</strong></p>");
        content.append("</body></html>");

        return content.toString();
    }

    private String buildUserConfirmationEmailContent(ContactFormRequest contactForm) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body style=\"font-family: Arial, sans-serif; line-height: 1.6;\">");
        content.append("<h2 style=\"color: #FF6600;\">Merci pour votre message, ").append(contactForm.getFullName()).append(" !</h2>");
        content.append("<p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>");

        content.append("<h3 style=\"color: #333;\">Récapitulatif de votre demande :</h3>");
        content.append("<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>");
        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Sujet :</strong></td><td>")
                .append(contactForm.getSubject().isEmpty() ? "Demande générale" : contactForm.getSubject())
                .append("</td></tr>");
        content.append("<tr><td style='background-color: #f5f5f5;'><strong>Votre message :</strong></td><td>").append(contactForm.getMessage()).append("</td></tr>");

        if (contactForm.getCallbackDateTime() != null) {
            content.append("<tr><td style='background-color: #f5f5f5;'><strong>Rappel demandé le :</strong></td><td>")
                    .append(contactForm.getCallbackDateTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")))
                    .append("</td></tr>");
        }

        content.append("</table>");
        content.append("<p style='margin-top: 20px;'>Notre équipe vous contactera prochainement pour répondre à votre demande.</p>");
        content.append("<p style='color: #666;'>Cordialement,<br/>");
        content.append("<strong style='color: #FF6600;'>L'équipe AssuFlex</strong><br/>");
        content.append("Votre partenaire en assurance santé</p>");
        content.append("</body></html>");

        return content.toString();
    }
}