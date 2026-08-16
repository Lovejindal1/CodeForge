import "./Register.css";

function Register() {
  return (
    <div className="auth-page">

      {/* LEFT SIDE - BRANDING */}
      <div className="brand-section">

        <div className="brand-logo">
          <div className="logo-symbol">&lt;/&gt;</div>
          <span>CodeForge</span>
        </div>

        <div className="brand-content">
          <p className="small-text">WELCOME TO THE DEVELOPER WORLD</p>

          <h1>
            BUILD.
            <br />
            SOLVE.
            <br />
            <span>COMPETE.</span>
          </h1>

          <p className="brand-description">
            Practice problems, write better code and sharpen
            your problem-solving skills with CodeForge.
          </p>

          {/* TERMINAL */}
          <div className="terminal-card">

            <div className="terminal-header">
              <div className="terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span className="terminal-title">
                codeforge.cpp
              </span>
            </div>

            <div className="terminal-body">
              <p>
                <span className="terminal-green">$</span> codeforge
              </p>

              <p>
                <span className="terminal-blue">&gt;</span>{" "}
                compiling solution.cpp
              </p>

              <p>
                <span className="terminal-green">✓</span> Test 1 passed
              </p>

              <p>
                <span className="terminal-green">✓</span> Test 2 passed
              </p>

              <p>
                <span className="terminal-green">✓</span> Test 3 passed
              </p>

              <p>
                <span className="terminal-green">✓</span>{" "}
                Accepted
              </p>
            </div>

          </div>
        </div>

        <div className="floating-symbol symbol-one">
          {"{ }"}
        </div>

        <div className="floating-symbol symbol-two">
          {"< >"}
        </div>

        <div className="floating-symbol symbol-three">
          {"[ ]"}
        </div>

      </div>


      {/* RIGHT SIDE - REGISTER */}
      <div className="form-section">

        <div className="register-card">

          <div className="mobile-logo">
            <div className="logo-symbol">&lt;/&gt;</div>
            <span>CodeForge</span>
          </div>

          <p className="form-welcome">
            START YOUR JOURNEY
          </p>

          <h2>Create Account</h2>

          <p className="form-subtitle">
            Join CodeForge and start solving problems.
          </p>


          <form>

            <div className="input-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
              />
            </div>


            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>


            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
              />
            </div>


            <div className="password-info">

              <span>✓ 8+ characters</span>
              <span>✓ Number</span>
              <span>✓ Special character</span>

            </div>


            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>


          <div className="divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>


          <p className="login-text">
            Already have an account?
            <span> Sign In</span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;