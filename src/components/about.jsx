import "prosekit/basic/typography.css";

import "./styles/about.css";
import "./styles/prosekit.css";

import Footer from "./footer.jsx";

const About = () => {
  return (
    <div className="about ProseMirror">
      <div className="about-content">
        <div>
          <h1 style="text-align: center;">About VNotes</h1>
          <h2 style="text-align: center;">Your notes stays yours.</h2>
          <p>
            VNotes is a simple, lightweight, and thoughtfully designed note-taking app built to make
            capturing and organizing your thoughts effortless.
          </p>
          <p>
            We believe taking notes shouldn't be complicated. Whether you're writing down a quick
            idea, saving something important, or organizing your everyday thoughts, VNotes gives you
            a clean and comfortable space to do it.
          </p>
          <p></p>
          <div class="prosekit-horizontal-rule">
            <hr />
          </div>
          <h3 style="text-align: left;">Our Philosophy</h3>
          <p>We believe good software should be simple, fast, and respectful of your privacy.</p>
          <p>
            That's why VNotes focuses on what matters most: a clean interface, smooth performance,
            and a local-first approach. No unnecessary complexity. No overwhelming features. Just a
            better way to take notes.
          </p>
          <p></p>
          <div class="prosekit-horizontal-rule">
            <hr />
          </div>
          <h3 style="text-align: left;">What Makes VNotes Special?</h3>
          <ul>
            <li>
              <p>
                <strong>Simple &amp; Clean</strong>: A modern, minimal interface that keeps your
                focus on your thoughts.
              </p>
            </li>
            <li>
              <p>
                <strong>Lightweight</strong>: Designed to use minimal system resources without
                compromising your experience.
              </p>
            </li>
            <li>
              <p>
                <strong>Fast &amp; Responsive</strong>: Open the app, capture your thoughts, and get
                things done.
              </p>
            </li>
            <li>
              <p>
                <strong>Local-First</strong>: Your notes are stored locally on your device.
              </p>
            </li>
            <li>
              <p>
                <strong>Private by Design</strong>: Your personal thoughts deserve a private space.
              </p>
            </li>
            <li>
              <p>
                <strong>Easy to Manage</strong>: Create, edit, delete, and organize your notes with
                ease.
              </p>
            </li>
          </ul>
          <p style="text-align: left;"></p>
          <div class="prosekit-horizontal-rule">
            <hr />
          </div>
          <h3 style="text-align: left;">A Work in Progress</h3>
          <p>
            VNotes is currently under active development and is available in an early alpha release.
          </p>
          <p>
            This means things may change, features may be incomplete, and you might occasionally
            encounter bugs or unexpected behavior.
          </p>
          <p>
            We're continuously working to improve the experience, fix issues, and make VNotes better
            with every update.
          </p>
          <p>
            Thank you for being here during these early stages. Your patience, feedback, and support
            mean a lot.
          </p>
          <p></p>
          <div class="prosekit-horizontal-rule">
            <hr />
          </div>
          <h3 style="text-align: left;">Our Promise</h3>
          <p>
            We're building VNotes with a simple goal: to create a note-taking experience that feels
            effortless, stays lightweight, and respects your privacy.
          </p>
          <p>No unnecessary distractions. Just your thoughts, organized your way.</p>
          <p>
            Thank you for choosing <strong>VNotes</strong>.
          </p>
          <p>
            <strong>Made with care, for your thoughts.</strong>
          </p>
        </div>
      </div>

      <Footer status={{ value: "" }} />
    </div>
  );
};

export default About;
