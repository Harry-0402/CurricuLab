
interface EmailTemplateProps {
    type: string;
    title: string;
    content: string;
    link?: string;
    linkText?: string;
    recipientCount?: number;
}

export const generateNotificationEmail = ({ type, title, content, link, linkText = "View Details", recipientCount = 1 }: EmailTemplateProps): string => {
    // Brand colors
    const primaryColor = "#4F46E5"; // Indigo-600
    const backgroundColor = "#F3F4F6";
    const white = "#FFFFFF";
    const textColor = "#1F2937";
    const mutedColor = "#6B7280";

    // Icon handling (simple unicode text fallback for email compatibility)
    const icon = type === 'Assignment' ? '📝' : type === 'Announcement' ? '📢' : '🔔';

    // Base64 encoded logo (embedded for email compatibility - full 1072 bytes)
    const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAmCAYAAADTGStiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAK4SURBVFhH7ZVNSJRBGICfmc/MFA3bBMXtYoluEKQkBG5QIFnhEh0SSowyCcJiK2iriwYa/YiQWIcwzIwuu4QQBmJGQZ4iwj1VB0HQSsgfSoh+3JkOn7r67bfrGrWXfGAYeOed9/leZnZWFJ2Z0aMTJBSnA2SipQCjEyCtwUSxIk4YK+K4KMkXBHySoTsGfp9k2yZhTVkSkVU9o63BWFTvFDQfk8gFrpACX6fiwYv4S8XdsRDQWCVpqTGlbT2awroQbT0aQ0JLjeTyIYmIs/m4Ol6TDO2nJLu3CkIKvHcV/oHwtkq3oLVWYkjoG9Qcb1P8+LWoRARLirPWQsAn2bxB8PUbHG1VDLyN3OJ2CTq9koxUCA5rDrcoPn+xZoWJKS7IBb/PICfTfF8PXg8xNGbNCrMxGwIXDJwO+DQFlTdCvP9gzTKJesa7tgh6G0xpcFhTVh9bCjA0BmX1IYLDmpxM6G0wcLvsD91W7HYJHp6TpKXA41eaikbF5LQ1y57JafA0KZ681qSlgN8n2V4QKbcVn90vSDKgo19Te2vpi2Ll+0+oaVN09GuSDPB64hTn55iJ959HPf4l0Rq6ZvcXOuMUJyeZs1KR4uI8gdcjOH9Azg+vR1CUF1k8pMw5ZZV1JcqtfnfbYF067Li0+FZWlAg6Ttt+KwBHbiq630TLFeQKXl6VTEyDqy60KDd6FRvKi8yu+oOa5u7w6A+asr3FkV1HY1ni1NXm/HRQ09yt5secOC1lcX4sliX+m6yIE4ateO73J+L9c43C3HY1W28htuKPU+YtPblH4HYJSmeHI91cz8sOx0pdgrxs07A+g/mY2yWo22fGRyYingr7B+REuaCpyvab/oiLXea7vRDb6u19mmuPFKPj1pXlMTIOVwKKe88ierPvOBHYdpwIVsQJ4z8UOx3W0L/H6YDfT7fnBRMEB/EAAAAASUVORK5CYII=";

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
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" valign="middle">
                                        <img src="data:image/png;base64,${logoBase64}" alt="CurricuLab Logo" style="width: 40px; height: 40px; margin-right: 12px; vertical-align: middle; display: inline-block;" />
                                    </td>
                                    <td align="center" valign="middle">
                                        <h1 style="color: ${white}; margin: 0; font-size: 24px; letter-spacing: 1px; display: inline-block; vertical-align: middle;">CurricuLab</h1>
                                    </td>
                                </tr>
                            </table>
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
                            ${recipientCount > 0 ? `
                            <p style="color: #D97706; font-size: 13px; margin: 0 0 10px 0; background: #FFFBEB; padding: 12px; border-radius: 8px; border: 1px solid #FCD34D;">
                                ⚠️ <strong>Demo Mode:</strong> This is a broadcast simulation. In production, this email would be sent to all ${recipientCount} registered user${recipientCount !== 1 ? 's' : ''}.
                            </p>
                            ` : ''}
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

export interface AssignmentEmailProps {
    title: string;
    dueDate?: string;
    authorName: string;
    link: string;
    recipientCount?: number;
}

export const generateAssignmentEmail = ({ title, dueDate, authorName, link, recipientCount = 1 }: AssignmentEmailProps): string => {
    const primaryColor = '#4F46E5';
    const backgroundColor = '#F3F4F6';
    const white = '#FFFFFF';
    const textColor = '#1F2937';
    const mutedColor = '#6B7280';
    const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAmCAYAAADTGStiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAK4SURBVFhH7ZVNSJRBGICfmc/MFA3bBMXtYoluEKQkBG5QIFnhEh0SSowyCcJiK2iriwYa/YiQWIcwzIwuu4QQBmJGQZ4iwj1VB0HQSsgfSoh+3JkOn7r67bfrGrWXfGAYeOed9/leZnZWFJ2Z0aMTJBSnA2SipQCjEyCtwUSxIk4YK+K4KMkXBHySoTsGfp9k2yZhTVkSkVU9o63BWFTvFDQfk8gFrpACX6fiwYv4S8XdsRDQWCVpqTGlbT2awroQbT0aQ0JLjeTyIYmIs/m4Ol6TDO2nJLu3CkIKvHcV/oHwtkq3oLVWYkjoG9Qcb1P8+LWoRARLirPWQsAn2bxB8PUbHG1VDLyN3OJ2CTq9koxUCA5rDrcoPn+xZoWJKS7IBb/PICfTfF8PXg8xNGbNCrMxGwIXDJwO+DQFlTdCvP9gzTKJesa7tgh6G0xpcFhTVh9bCjA0BmX1IYLDmpxM6G0wcLvsD91W7HYJHp6TpKXA41eaikbF5LQ1y57JafA0KZ681qSlgN8n2V4QKbcVn90vSDKgo19Te2vpi2Ll+0+oaVN09GuSDPB64hTn55iJ959HPf4l0Rq6ZvcXOuMUJyeZs1KR4uI8gdcjOH9Azg+vR1CUF1k8pMw5ZZV1JcqtfnfbYF067Li0+FZWlAg6Ttt+KwBHbiq630TLFeQKXl6VTEyDqy60KDd6FRvKi8yu+oOa5u7w6A+asr3FkV1HY1ni1NXm/HRQ09yt5secOC1lcX4sliX+m6yIE4ateO73J+L9c43C3HY1W28htuKPU+YtPblH4HYJSmeHI91cz8sOx0pdgrxs07A+g/mY2yWo22fGRyYingr7B+REuaCpyvab/oiLXea7vRDb6u19mmuPFKPj1pXlMTIOVwKKe88ierPvOBHYdpwIVsQJ4z8UOx3W0L/H6YDfT7fnBRMEB/EAAAAASUVORK5CYII=";

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Assignment: ${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${backgroundColor}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${backgroundColor}; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: ${white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <tr>
                        <td align="center" style="background-color: ${primaryColor}; padding: 30px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" valign="middle">
                                        <img src="data:image/png;base64,${logoBase64}" alt="CurricuLab Logo" style="width: 40px; height: 40px; margin-right: 12px; vertical-align: middle; display: inline-block;" />
                                    </td>
                                    <td align="center" valign="middle">
                                        <h1 style="color: ${white}; margin: 0; font-size: 24px; letter-spacing: 1px; display: inline-block; vertical-align: middle;">CurricuLab</h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <span style="background-color: #EEF2FF; color: ${primaryColor}; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                    📝 New Assignment
                                </span>
                            </div>
                            <h2 style="color: ${textColor}; margin: 0 0 15px 0; font-size: 20px; text-align: center;">
                                ${title}
                            </h2>
                            <p style="color: ${mutedColor}; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 20px 0;">
                                A new assignment has been posted by <strong>${authorName}</strong>.
                            </p>
                            ${dueDate ? `<p style="color: ${mutedColor}; font-size: 14px; text-align: center; margin: 0 0 30px 0;">Due Date: ${dueDate}</p>` : '<div style="margin-bottom: 30px;"></div>'}
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${link}" target="_blank" style="background-color: ${primaryColor}; color: ${white}; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.4);">
                                            View Assignment
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} CurricuLab. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                        <td align="center" style="padding-top: 20px;">
                            ${recipientCount > 0 ? `
                            <p style="color: #D97706; font-size: 13px; margin: 0 0 10px 0; background: #FFFBEB; padding: 12px; border-radius: 8px; border: 1px solid #FCD34D;">
                                ⚠️ <strong>Demo Mode:</strong> This email was sent to ${recipientCount} registered user${recipientCount !== 1 ? 's' : ''}.
                            </p>
                            ` : ''}
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
</html>`;
};
