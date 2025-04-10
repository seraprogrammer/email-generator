import { useState, FormEvent, ChangeEvent } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface EmailTemplate {
  subject: string;
  body: string;
}

function App() {
  const [websiteIssue, setWebsiteIssue] = useState("");
  const [emailAddress, setEmailAddress] = useState("olova.dev@gmail.com");
  const [websiteLink, setWebsiteLink] = useState("https://seraprogrammer.com/");
  const [portfolioLink, setPortfolioLink] = useState(
    "https://codervai.vercel.app/"
  );
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize the API with your key
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTemplates([]);
    setError("");

    const baseTemplate = `
Hello there,

My name is Nazmul Hossain, and I'm reaching out from Sera Programmer, a modern software agency specializing in web development.

We build websites using the latest technologies like React, Next.js, Vue.js, and Svelte, along with powerful design systems that make your site stand out, load fast, and work great on any device.

While visiting your website, we noticed a few areas that could be improved:

[WEBSITE_ISSUE]

We'd love to help you rebuild or upgrade your site to make it:

Fully responsive and mobile-friendly

Modern and visually appealing

Optimized for performance and user experience

In 2025, having a cool, clean, and user-friendly website isn't just an option—it's a necessity.

✨ Ready to transform your online presence? ✨

If you're interested, we'd be happy to provide a free consultation and show you what your updated site could look like. Here's how to get started:

🔹 Reply to this email with "Let's talk" to schedule your FREE consultation
🔹 Visit ${websiteLink || "[Your website link]"} and use our contact form


Take your first step toward a website that truly represents your brand's potential!

Looking forward to hearing from you!

Best regards,
Nazmul Hossain
Sera Programmer
📧 ${emailAddress || "[Your email address]"}
🌐 ${websiteLink || "[Your website link]"}${
      portfolioLink ? `\n💼 ${portfolioLink}` : ""
    }`;

    const prompt = `Generate 3 different professional email templates for a web development agency.
    
    Each email should follow this exact structure, but with variations in wording, tone, and specific details:
    
    1. Use a catchy, professional subject line about modernizing websites for 2025
    2. Use this exact email body template, but replace [WEBSITE_ISSUE] with creative and detailed descriptions of the website issue: "${websiteIssue}"
    
    ${baseTemplate}
    
    Format the response as JSON with this structure for each template:
    {
      "templates": [
        {
          "subject": "Subject line here",
          "body": "Full email body here with proper line breaks"
        },
        {
          "subject": "Different subject line here",
          "body": "Different full email body here with proper line breaks"
        },
        {
          "subject": "Another different subject line here",
          "body": "Another different full email body here with proper line breaks"
        }
      ]
    }
    
    Make sure to maintain the exact structure of the template while making the content variations feel natural and professional.
    Each template should describe the website issue (${websiteIssue}) in a different, detailed way.`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      try {
        // Extract the JSON part from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : responseText;
        const parsedResponse = JSON.parse(jsonString);

        if (
          parsedResponse.templates &&
          Array.isArray(parsedResponse.templates)
        ) {
          setTemplates(parsedResponse.templates);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (parseErr) {
        console.error("Error parsing response:", parseErr);
        setError("Failed to parse the AI response. Please try again.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Error: ${errorMessage}`);
      console.error("Full error details:", err);
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Email copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-green-100">
        <h1 className="text-3xl font-bold text-emerald-800 mb-8 text-center">
          AI Email Generator for Web Development Services
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Website Issue Description
              </label>
              <textarea
                value={websiteIssue}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setWebsiteIssue(e.target.value)
                }
                placeholder="Describe the specific issue with their website, e.g., 'the site isn't mobile-friendly,' 'it looks outdated,' or 'it loads slowly.'"
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/60 backdrop-blur-sm resize-y min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmailAddress(e.target.value)
                }
                placeholder="your.email@example.com"
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/60 backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Your Website Link
              </label>
              <input
                type="url"
                value={websiteLink}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setWebsiteLink(e.target.value)
                }
                placeholder="https://example.com"
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/60 backdrop-blur-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-emerald-700 mb-1">
                Your Portfolio Link (Optional)
              </label>
              <input
                type="url"
                value={portfolioLink}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPortfolioLink(e.target.value)
                }
                placeholder="https://portfolio.example.com"
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/60 backdrop-blur-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            } transition-all duration-300 transform hover:scale-[1.01]`}
          >
            {loading ? "Generating Emails..." : "Generate Email Templates"}
          </button>
        </form>

        {error && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error:</h2>
            <div className="p-4 bg-red-50/80 backdrop-blur-sm rounded-lg border border-red-200 text-red-700">
              {error}
            </div>
          </div>
        )}

        {templates.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
              Your AI-Generated Email Templates:
            </h2>

            {templates.map((template, index) => (
              <div
                key={index}
                className="p-5 bg-white/70 backdrop-blur-sm rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-emerald-700">
                    Template {index + 1}
                  </h3>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Subject: ${template.subject}\n\n${template.body}`
                      )
                    }
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-md hover:from-emerald-600 hover:to-green-700 text-sm shadow-sm transition-all duration-300"
                  >
                    Copy
                  </button>
                </div>

                <div className="mb-3 p-2 bg-green-50/80 rounded-md">
                  <span className="font-medium text-emerald-800">Subject:</span>{" "}
                  <span className="text-emerald-700">{template.subject}</span>
                </div>

                <div className="whitespace-pre-wrap text-gray-700 bg-white/60 p-3 rounded-md border border-green-100">
                  {template.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
