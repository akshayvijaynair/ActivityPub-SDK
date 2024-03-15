const nodemailer = require("nodemailer");
const {Octokit} = require("octokit");

/**
 * 
 * @type {Octokit}
 */
const octokit = new Octokit({
    auth: '',
});



/**
 * Paste your generated 16-digit password here as your password
 *     To generate the password make sure to follow these steps,
 *     Turn on 2-Step Verification in your Gmail
 *     Go to your Google Account.
 *     Select Security.
 *     Under "Signing in to Google," select 2-Step Verification.
 *     At the bottom of the page, select App passwords.
 *     Enter a name that helps you remember where you’ll use the app password.
 *     Select Generate.
 *     To enter the app password, follow the instructions on your screen. The app password is the 16-character code that generates on your device.
 *     Select Done.
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "akshayvijaynair@gmail.com",
        pass: "",
    },
});

const sendEmail = async(commitDetails) => {

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: ' Me <akshayvijaynair@gmail.com>', // sender address
        to: "akshayvijaynair@gmail.com", // list of receivers
        subject: "Most Recent Updates on SE-675 project", // Subject line
        html: `
        <h1> Commit Details </h1>
        <div>${commitDetails.join('')}</div>
        `
    });

    console.log("Message sent: %s", info.messageId);
}

const listCommits = async () => {
    return await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'akshayvijaynair',
        repo: 'activitypub-sdk',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
}

const getCommitSummary = (data) => {
    return `<h2>${new Date(data.commit.author.date).toLocaleDateString('en-US')}</h2>
<div>${data.commit.author.name} | ${data.commit.message}</div>`;
}

listCommits().then((data) => {
    const commitDetails = data.data.map(getCommitSummary);
    sendEmail(commitDetails).catch(console.error);
    }
)
