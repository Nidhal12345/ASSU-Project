package com.assuflex.assuflexapi.utils;

import com.assuflex.assuflexapi.DTO.ContractDTO;
import com.assuflex.assuflexapi.DTO.devisDTO;
import com.itextpdf.html2pdf.HtmlConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import java.io.ByteArrayOutputStream;

@Service
public class PdfGenerationService {

    @Autowired
    private TemplateEngine templateEngine;

    public byte[] generatePdfFromHtml(String templateName, devisDTO data) {
        Context context = new Context();
        System.out.println(data.toString());
        context.setVariable("devis", data);
        String html = templateEngine.process(templateName, context);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        HtmlConverter.convertToPdf(html, outputStream);
        return outputStream.toByteArray();
    }

    public byte[] generatePdfFromHtml(String templateName, ContractDTO data) {
        Context context = new Context();
        System.out.println(data.toString());
        context.setVariable("contract", data);
        String html = templateEngine.process(templateName, context);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        HtmlConverter.convertToPdf(html, outputStream);
        return outputStream.toByteArray();
    }
}
