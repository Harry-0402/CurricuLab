
interface EmailTemplateProps {
    type: string;
    title: string;
    content: string;
    link?: string;
    linkText?: string;
}

export const generateNotificationEmail = ({ type, title, content, link, linkText = "View Details" }: EmailTemplateProps): string => {
    // Brand colors
    const primaryColor = "#4F46E5"; // Indigo-600
    const backgroundColor = "#F3F4F6";
    const white = "#FFFFFF";
    const textColor = "#1F2937";
    const mutedColor = "#6B7280";

    // Icon handling (simple unicode text fallback for email compatibility)
    const icon = type === 'Assignment' ? '📝' : type === 'Announcement' ? '📢' : '🔔';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CurricuLab Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${backgroundColor}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${backgroundColor}; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: ${white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: ${primaryColor}; padding: 30px;">
                            <h1 style="color: ${white}; margin: 0; font-size: 24px; letter-spacing: 1px;">CurricuLab</h1>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Type Badge -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <span style="background-color: #EEF2FF; color: ${primaryColor}; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ${icon} ${type}
                                </span>
                            </div>

                            <!-- Title -->
                            <h2 style="color: ${textColor}; margin: 0 0 15px 0; font-size: 20px; text-align: center;">
                                ${title}
                            </h2>

                            <!-- Content -->
                            <p style="color: ${mutedColor}; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 30px 0;">
                                ${content}
                            </p>

                            <!-- Button Action -->
                            ${link ? `
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${link}" target="_blank" style="background-color: ${primaryColor}; color: ${white}; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.4);">
                                            ${linkText}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} CurricuLab. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Unsubscribe / Extra Info -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                                You received this email because you are part of the CurricuLab organization.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};
