import "./Login.css";

function Login() {
  return (
    <div className="auth-page">

      {/* LEFT SIDE - BRANDING */}
      <div className="brand-section">

        <div className="brand-logo">
          <div className="logo-symbol">&lt;/&gt;</div>
          <span>CodeForge</span>
        </div>

        <div className="brand-content">

          <p className="small-text">
            WELCOME BACK, DEVELOPER
          </p>

          <h1>
            BUILD.
            <br />
            SOLVE.
            <br />
            <span>COMPETE.</span>
          </h1>

          <p className="brand-description">
            Continue solving problems, improving your code
            and sharpening your problem-solving skills.
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
                <span className="terminal-green">$</span>{" "}
                codeforge login
              </p>

              <p>
                <span className="terminal-blue">&gt;</span>{" "}
                authenticating developer...
              </p>

              <p>
                <span className="terminal-green">✓</span>{" "}
                identity verified
              </p>

              <p>
                <span className="terminal-green">✓</span>{" "}
                loading workspace
              </p>

              <p>
                <span className="terminal-green">✓</span>{" "}
                ready to code
              </p>

            </div>

          </div>

        </div>


        {/* FLOATING CODE SYMBOLS */}

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


      {/* RIGHT SIDE - LOGIN */}

      <div className="form-section">

        <div className="login-card">

          {/* MOBILE LOGO */}

          <div className="mobile-logo">

            <div className="logo-symbol">
              &lt;/&gt;
            </div>

            <span>CodeForge</span>

          </div>


          <p className="form-welcome">
            WELCOME BACK
          </p>

          <h2>
            Sign In
          </h2>

          <p className="form-subtitle">
            Login to continue your coding journey.
          </p>


          <form>

            {/* EMAIL */}

            <div className="input-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
              />

            </div>


            {/* PASSWORD */}

            <div className="input-group">

              <div className="password-label">

                <label>
                  Password
                </label>

                <span className="forgot-password">
                  Forgot password?
                </span>

              </div>

              <input
                type="password"
                placeholder="Enter your password"
              />

            </div>


            {/* REMEMBER ME */}

            <div className="remember-row">

              <label className="remember-label">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
            >
              Sign In
            </button>

          </form>


          {/* DIVIDER */}

          <div className="divider">

            <span></span>

            <p>OR</p>

            <span></span>

          </div>


          {/* REGISTER */}

          <p className="register-text">

            Don't have an account?

            <span>
              {" "}Create Account
            </span>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;

