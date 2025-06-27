function generateEmailTemplate(ticket, response) {
    const { salutation, firstName, lastName, title, _id, status } = ticket;
    const subject = `Support Ticket #${_id} - ${status}`;
    let body = `Dear ${salutation} ${firstName} ${lastName},\n\n`;
    body += `Your support ticket titled "${title}" has been updated to status: ${status}.\n`;
    if (response) {
        body += `\nResponse from Support Team:\n${response}\n`;
    }
    body += `\nYou can view your ticket details at: https://yourdomain.com/tickets/${_id}\n\nThank you,\nSupport Team`;
    return { subject, body };
}

module.exports = { generateEmailTemplate };
