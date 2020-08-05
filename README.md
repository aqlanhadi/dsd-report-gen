# dsd-report-gen
**Serverless-centric architecture for Maybank's Digital Skills Development survey responder.**

This is a second version of Digital Skills Development application for handling responses submitted through its [Typeform](https://malayanbanking.typeform.com/to/n4YTpi) survey.

The application is now configured as a serverless application, and is now [deployed](https://vibqddnlpl.execute-api.ap-southeast-1.amazonaws.com/production) as production on AWS Lambda.

## Addressed (Major) Issues in regards to V1

1. **Maximized Email Support.** I have completely redesigned the email architecture as relying on an external styling framework while dealing with emails comes with quite a number of avoidable issues. The email is now styled inline, in a single Pug HTML file for maximum compatibility across multiple mail platform.

| ![Alpha 0](/assets/images/alpha0.PNG) | ![Alpha 1](/assets/images/alpha1.PNG) | ![Beta 0](/assets/images/beta0.PNG) |
|:--:| :--:| :--:| 
| *Alpha 0* | *Alpha 1* | *Beta 0 (Current)* |
| Minimal Compatibility, Great UI | Maximum Compatibility, OK UI | Maximum Compatibility, Better UI |  

2. **Simplified Data Extraction.** On the previous version, data is extracted across all five survey forms, which in turn complicates asynchronous operations, as the application needed to check whether a response is complete before processing and rendering the email. With the help of [Ain](https://www.linkedin.com/in/nurulain-mohamad-shah-599518125/) and Syahirah, all the data from previous forms are brought forward to the last Typeform, and the application only receives and processes the last response to render the email.

This project is part of the author's deliverables while interning for Maybank's Digital Skills Development.

See [V1](https://github.com/aqlanhadi/dsd-email-engine).