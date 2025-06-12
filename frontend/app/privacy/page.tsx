import { Shield } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | TinyBlog',
  description: 'Learn how we protect and handle your data',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="space-y-4">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you register for an account, 
              subscribe to our newsletter, respond to a survey, or otherwise communicate with us. 
              The types of information we may collect include your name, email address, and any other 
              information you choose to provide.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2>2. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2>3. Information Sharing</h2>
            <p>
              We do not share or sell your personal information to third parties except as described 
              in this Privacy Policy or with your consent. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who perform services on our behalf</li>
              <li>Law enforcement or other government officials, in response to a verified request</li>
              <li>Other parties in connection with any company transaction</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2>4. Your Choices</h2>
            <p>You have the following choices regarding your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Update your account information through your profile settings</li>
              <li>Opt-out of receiving promotional communications from us</li>
              <li>Request deletion of your account by contacting us</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security 
              of your personal information. However, no method of transmission over the Internet or 
              electronic storage is 100% secure.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@tinyblog.com" className="text-primary hover:underline">
                privacy@tinyblog.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
