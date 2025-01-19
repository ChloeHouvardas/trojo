import './Emails.css'; // Import the CSS file

const Emails = () => {
    return (
        <div className="emails-container">
            <h1 className="emails-header">Emails</h1>
            <div className="email-list">
                <div className="email-box">
                    <h2>Email 1</h2>
                    <p>Dear Team,</p>
                    <p>I hope this email finds you well. I wanted to take a moment to update you on the progress of our current project. Over the past few weeks, we have made significant strides in the development phase, and I am pleased to report that we are on track to meet our deadlines. The design team has completed the initial mockups, and the development team is now working on the implementation. We have encountered a few challenges along the way, but we have managed to overcome them through collaboration and innovative problem-solving. I am confident that we will continue to make great progress in the coming weeks. Thank you for your hard work and dedication to this project.</p>
                    <p>Best regards,<br/>Project Manager</p>
                </div>
                <div className="email-box">
                    <h2>Email 2</h2>
                    <p>Hi Everyone,</p>
                    <p>I wanted to remind you all about the upcoming team meeting scheduled for next Monday at 10 AM. During this meeting, we will be discussing the latest updates on our project, reviewing the current status of our tasks, and planning the next steps. It is important that everyone attends this meeting, as we will be making some critical decisions that will impact our timeline and deliverables. Please come prepared with any questions or concerns you may have, as well as any updates on your individual tasks. I look forward to seeing you all there and working together to ensure the success of our project.</p>
                    <p>Best,<br/>Team Lead</p>
                </div>
                <div className="email-box">
                    <h2>Email 3</h2>
                    <p>Hello Team,</p>
                    <p>I am writing to inform you about a new initiative that we will be launching next month. This initiative aims to improve our internal communication and collaboration by implementing a new project management tool. The tool will help us streamline our workflows, track progress more effectively, and enhance our overall productivity. We will be providing training sessions for all team members to ensure a smooth transition to the new system. I believe this change will greatly benefit our team and help us achieve our goals more efficiently. Please stay tuned for more details and the schedule for the training sessions.</p>
                    <p>Thank you,<br/>Operations Manager</p>
                </div>
            </div>
        </div>
    );
};

export default Emails;
