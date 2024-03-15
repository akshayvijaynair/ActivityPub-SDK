const nodemailer = require("nodemailer");
const {Octokit} = require("octokit");

// add in a PAT from github
const octokit = new Octokit({
    auth: '',
});


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
        `, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
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



