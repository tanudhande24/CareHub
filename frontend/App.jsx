import React, { useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabase";

import {
  Activity,
  BarChart3,
  CalendarDays,
  FileText,
  GitCompareArrows,
  TrendingDown,
  TrendingUp,
  ArrowLeft,
  Camera,
  Droplets,
  HeartPulse,
  Home,
  MessageCircle,
  Plus,
  Scale,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";


const features = [
  {
    title: "Water Intake",
    description: "Track your daily water",
    icon: Droplets,
    tone: "blue",
  },
  {
    title: "Weight",
    description: "Keep track of your weight",
    icon: Scale,
    tone: "purple",
  },
  {
    title: "Health Analyzer",
    description: "Understand your health reports",
    icon: Activity,
    tone: "teal",
  },
  {
    title: "Health Score",
    description: "See your overall health score",
    icon: HeartPulse,
    tone: "pink",
  },
];

const WATER_GOAL = 2000;
const GLASS_SIZE = 250;
const GLASS_COUNT = WATER_GOAL / GLASS_SIZE;

function AuthPage() {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const cleanEmail = email.trim();

      if (!cleanEmail) {
        throw new Error("Please enter your email.");
      }

      if (!password) {
        throw new Error("Please enter your password.");
      }

      if (mode === "signup") {
        if (!name.trim()) {
          throw new Error("Please enter your full name.");
        }

        if (password.length < 8) {
          throw new Error(
            "Password must be at least 8 characters."
          );
        }

        if (password !== confirmPassword) {
          throw new Error(
            "Passwords do not match."
          );
        }

        const { error } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: name.trim(),
              },
            },
          });

        if (error) {
          throw error;
        }

        setMessage(
          "Account created successfully. Please check your email if verification is enabled."
        );

        setMode("login");
        setPassword("");
        setConfirmPassword("");

      } else {

        const { error } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

        if (error) {
          throw error;
        }
      }

    } catch (authError) {

      console.error(
        "Authentication error:",
        authError
      );

      const rawMessage =
        (authError?.message || "").toLowerCase();

      if (
        rawMessage.includes(
          "email not confirmed"
        )
      ) {
        setError(
          "Please confirm your email before signing in. Check your inbox."
        );

      } else if (
        rawMessage.includes(
          "invalid login credentials"
        )
      ) {
        setError(
          "Incorrect email or password."
        );

      } else if (
        rawMessage.includes(
          "user already registered"
        ) ||
        rawMessage.includes(
          "already been registered"
        )
      ) {
        setError(
          "An account with this email already exists."
        );

        setMode("login");

      } else {
        setError(
          authError?.message ||
          "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell auth-app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <section className="auth-card glass">

        {/* BRAND */}

        <div className="auth-brand">

          <div className="auth-logo">
            <HeartPulse size={29} />
          </div>

          <div>
            <p className="eyebrow">
              CareHub
            </p>

            <strong>
              Your simple health companion
            </strong>
          </div>

        </div>


        {/* HEADING */}

        <div className="auth-heading">

          <p className="eyebrow">
            {mode === "login"
              ? "Welcome back"
              : "Get started"}
          </p>

          <h1>
            {mode === "login"
              ? "Sign in to CareHub"
              : "Create your account"}
          </h1>

          <p>
            {mode === "login"
              ? "Log in to access your personal CareHub dashboard."
              : "Create an account to keep your CareHub data connected to you."}
          </p>

        </div>


        {/* TABS */}

        <div
          className="auth-tabs"
          role="tablist"
        >

          <button
            type="button"
            className={
              mode === "login"
                ? "active"
                : ""
            }
            onClick={() =>
              switchMode("login")
            }
          >
            Sign in
          </button>

          <button
            type="button"
            className={
              mode === "signup"
                ? "active"
                : ""
            }
            onClick={() =>
              switchMode("signup")
            }
          >
            Create account
          </button>

        </div>


        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}

          {mode === "signup" && (
            <label>

              <span>
                Full name
              </span>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                autoComplete="name"
              />

            </label>
          )}


          {/* EMAIL */}

          <label>

            <span>
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
            />

          </label>


          {/* PASSWORD */}

          <label>

            <span>
              Password
            </span>

            <div className="password-field">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="At least 8 characters"
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </label>


          {/* CONFIRM PASSWORD */}

          {mode === "signup" && (
            <label>

              <span>
                Confirm password
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />

            </label>
          )}


          {/* ERROR */}

          {error && (
            <div
              className="auth-alert"
              role="alert"
            >
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {message && (
            <div
              className="auth-alert success"
              role="status"
            >
              {message}
            </div>
          )}


          {/* SUBMIT */}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign in"
              : "Create account"}
          </button>

        </form>


        {/* FOOTNOTE */}

        <p className="auth-footnote">
          CareHub provides AI-generated educational
          information and does not replace professional
          medical advice.
        </p>

      </section>

    </main>
  );
}

function App() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [showWater, setShowWater] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [showHealthScore, setShowHealthScore] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [water, setWater] = useState(500);
  const [weight, setWeight] = useState(58.4);
  const [weightInput, setWeightInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [session, setSession] = useState(undefined);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [weightHistory, setWeightHistory] = useState([
    { id: 1, date: "Today", value: 58.4 },
    { id: 2, date: "Yesterday", value: 58.7 },
    { id: 3, date: "Aug 13", value: 59.1 },
  ]);

  useEffect(() => {
  let mounted = true;

  supabase.auth.getSession().then(({ data }) => {
    if (mounted) {
      setSession(data.session);
    }
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_event, newSession) => {
      setSession(newSession);
    }
  );

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

  const openFeature = (title) => {
    if (title === "Water Intake") {
      setShowWater(true);
      return;
    }

    if (title === "Weight") {
      setShowWeight(true);
      return;
    }

    if (title === "Health Analyzer") {
      setShowAnalyzer(true);
      return;
    }

    if (title === "Health Score") {
      setShowHealthScore(true);
      return;
    }

    setActiveFeature(title);
  };

  if (showWater) {
    return (
      <WaterPage
        water={water}
        onSetWater={setWater}
        onBack={() => setShowWater(false)}
      />
    );
  }

  if (showAnalyzer) {
    return (
      <AnalyzerPage
        water={water}
        weight={weight}
        weightHistory={weightHistory}
        onBack={() => setShowAnalyzer(false)}
      />
    );
  }

  if (showHealthScore) {
    return (
      <HealthScorePage
        water={water}
        weight={weight}
        onBack={() => setShowHealthScore(false)}
      />
    );
  }

  if (showCamera) {
    return <CameraPage onBack={() => setShowCamera(false)} />;
  }

  if (showChat) {
    return <AIChatPage onBack={() => setShowChat(false)} />;
  }

  if (showWeight) {
    return (
      <WeightPage
        weight={weight}
        setWeight={setWeight}
        weightInput={weightInput}
        setWeightInput={setWeightInput}
        history={weightHistory}
        setHistory={setWeightHistory}
        onBack={() => setShowWeight(false)}
      />
    );
  }

  if (session === undefined) {
  return (
    <main className="app-shell">
      <section
        className="phone"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="glass" style={{ padding: "30px" }}>
          Checking your account...
        </div>
      </section>
    </main>
  );
}

if (!session) {
  return <AuthPage />;
}

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <section className="phone">
        <header className="welcome-card glass">
          <div>
            <p className="eyebrow">CareHub</p>
            <h1>
              Welcome <span aria-hidden="true">👋</span>
            </h1>
            <p className="welcome-subtitle">
                {session?.user?.user_metadata?.full_name || "User"} · Good to see you again!
            </p>
          </div>

         <button className="profile-button glass-button"
                 aria-label="Logout"
                 title="Logout"
                 onClick={async () => {
            const { error } = await supabase.auth.signOut();

           if (error) {
               console.error("Logout error:", error);
           }
 }}
>
  <LogOut size={27} strokeWidth={2} />
</button>
        </header>

        <section className="feature-grid" aria-label="CareHub features">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <button
                className={`feature-card glass ${feature.tone}`}
                key={feature.title}
                onClick={() => openFeature(feature.title)}
              >
                <span className="feature-icon">
                  <Icon size={30} strokeWidth={2.2} />
                </span>

                <span className="feature-content">
                  <strong>{feature.title}</strong>
                  <small>{feature.description}</small>
                </span>
              </button>
            );
          })}
        </section>

        <nav className="bottom-nav glass" aria-label="Main navigation">
          <button
            className="nav-button"
            aria-label="Home"
            onClick={() => setActiveFeature(null)}
          >
            <Home size={25} />
            <small>Home</small>
          </button>

          <button
            className="camera-button"
            onClick={() => setShowCamera(true)}
            aria-label="Scan medical report"
          >
            <span>
              <Camera size={31} />
            </span>
            <small>Camera</small>
          </button>

         <button
            className="nav-button"
            aria-label="AI Chat"
            onClick={() => setShowChat(true)}
>          
            <MessageCircle size={25} />
            <small>AI Chat</small>
          </button>
        </nav>
      </section>

      {activeFeature && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveFeature(null)}
        >
          <div
            className="modal glass"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="nav-button"
              aria-label="AI Chat"
              onClick={() => setShowChat(true)}
>
  <MessageCircle size={25} />
  <small>AI Chat</small>

              <X size={20} />
             </button>

            <div className="modal-icon">
              {activeFeature === "Camera" ? (
                <Camera size={32} />
              ) : activeFeature === "AI Chat" ? (
                <MessageCircle size={32} />
              ) : (
                <Home size={32} />
              )}
            </div>

            <h2>{activeFeature}</h2>

            <p>
              This screen is part of the CareHub frontend prototype. We will
              connect its real functionality in the backend phase.
            </p>

            <button
              className="primary-button"
              onClick={() => setActiveFeature(null)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


/* =========================================================
   HEALTH ANALYZER PAGE
========================================================= */

function AnalyzerPage({ water, weight, weightHistory, onBack }) {
  const [previousReport, setPreviousReport] = useState(null);
  const [newReport, setNewReport] = useState(null);

  const [comparisonLoading, setComparisonLoading] =
    useState(false);

  const [comparisonResult, setComparisonResult] =
    useState(null);

  const [comparisonError, setComparisonError] =
    useState("");

  const weeklyWater = [
    { day: "Mon", glasses: 6 },
    { day: "Tue", glasses: 8 },
    { day: "Wed", glasses: 5 },
    { day: "Thu", glasses: 7 },
    { day: "Fri", glasses: 8 },
    { day: "Sat", glasses: 4 },
    {
      day: "Sun",
      glasses: Math.max(
        1,
        Math.round(water / GLASS_SIZE)
      ),
    },
  ];

  const maxGlasses = 8;

  const weeklyTotal = weeklyWater.reduce(
    (sum, item) => sum + item.glasses,
    0
  );

  const weeklyAverage = (
    weeklyTotal / weeklyWater.length
  ).toFixed(1);

  const weightPoints = weightHistory
    .slice(0, 5)
    .reverse()
    .map((item) => item.value);

  const latestWeight = weight;

  const firstWeight =
    weightPoints[0] ?? weight;

  const weightChange =
    latestWeight - firstWeight;

  // ==========================================
  // REAL AI REPORT COMPARISON
  // ==========================================

  const compareReports = async () => {
    if (!previousReport || !newReport) {
      setComparisonError(
        "Please select both previous and new reports."
      );

      return;
    }

    setComparisonLoading(true);
    setComparisonError("");
    setComparisonResult(null);

    try {
      const formData = new FormData();

      formData.append(
        "previousReport",
        previousReport
      );

      formData.append(
        "newReport",
        newReport
      );

      const response = await fetch(
        "http://localhost:5000/api/compare-reports",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Report comparison failed."
        );
      }

      setComparisonResult(data);

    } catch (error) {
      console.error(
        "Report comparison error:",
        error
      );

      setComparisonError(
        error.message ||
          "Could not compare reports."
      );

    } finally {
      setComparisonLoading(false);
    }
  };

  const clearComparison = () => {
    setPreviousReport(null);
    setNewReport(null);
    setComparisonResult(null);
    setComparisonError("");
  };

  return (
    <main className="app-shell analyzer-app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <section className="phone analyzer-phone">

        {/* HEADER */}

        <header className="camera-header">

          <button
            className="back-button glass-button"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft size={23} />
          </button>

          <div>
            <p className="eyebrow">
              CareHub
            </p>

            <h1>
              Health Analyzer
            </h1>
          </div>

          <div className="camera-header-icon glass">
            <Activity size={23} />
          </div>

        </header>


        {/* WATER ANALYZER */}

        <section className="glass analyzer-card water-analyzer-card">

          <div className="analyzer-card-heading">

            <div className="analyzer-title">

              <span className="analyzer-icon blue-icon">
                <Droplets size={22} />
              </span>

              <div>
                <p className="eyebrow">
                  01 · Water analyzer
                </p>

                <h2>
                  Weekly Water Intake
                </h2>
              </div>

            </div>

            <div className="analyzer-stat">
               <strong>{weeklyAverage}</strong>
               <span>glasses/day</span>
            </div>

          </div>


          <div className="water-chart"
              aria-label="Weekly water intake bar chart"
          >

            {weeklyWater.map((item) => (

              <div className="water-bar-column"
                  key={item.day}
              >

             <span className="bar-value">
                 {item.glasses}
             </span>

             <div className="water-bar-track">

                  <div
                    className="water-bar"
                    style={{
                      height: `${
                        (item.glasses /
                          maxGlasses) *
                        100
                      }%`,
                    }}
                  >
                    <span className="mini-wave" />
                  </div>

                </div>

                <span className="bar-day">
                  {item.day}
                </span>

              </div>

            ))}

          </div>


          <div className="water-analyzer-footer">

            <div>
              <strong>
                {weeklyTotal} glasses
              </strong>

              <span>
                this week
              </span>
            </div>

            <div className="mini-glasses">

              {Array.from(
                { length: 8 },
                (_, i) => (

                  <span
                    key={i}
                    className={
                      i <
                      Math.min(
                        8,
                        weeklyWater[6].glasses
                      )
                        ? "mini-glass filled"
                        : "mini-glass"
                    }
                  >
                    <span />
                  </span>

                )
              )}

            </div>

          </div>

        </section>


        {/* WEIGHT ANALYZER */}

        <section className="glass analyzer-card weight-analyzer-card">

          <div className="analyzer-card-heading">

            <div className="analyzer-title">

              <span className="analyzer-icon purple-icon">
                <Scale size={22} />
              </span>

              <div>

                <p className="eyebrow">
                  02 · Weight analyzer
                </p>

                <h2>
                  Recent weight trend
                </h2>

              </div>

            </div>


            <div
              className={`trend-badge ${
                weightChange > 0
                  ? "trend-up"
                  : weightChange < 0
                  ? "trend-down"
                  : ""
              }`}
            >

              {weightChange < 0 ? (
                <TrendingDown size={16} />
              ) : (
                <TrendingUp size={16} />
              )}

              {Math.abs(
                weightChange
              ).toFixed(1)} kg

            </div>

          </div>


          <div className="weight-trend-visual">

            <div className="weight-big-number">

              <strong>
                {latestWeight.toFixed(1)}
              </strong>

              <span>
                kg
              </span>

            </div>


            <div className="weight-bars">

              {weightPoints.map(
                (value, index) => {

                  const min =
                    Math.min(
                      ...weightPoints,
                      latestWeight
                    ) - 1;

                  const max =
                    Math.max(
                      ...weightPoints,
                      latestWeight
                    ) + 1;

                  const range =
                    Math.max(
                      max - min,
                      1
                    );

                  const height =
                    ((value - min) /
                      range) *
                      65 +
                    20;

                  return (
                    <div
                      className="weight-bar-column"
                      key={`${value}-${index}`}
                    >

                      <span>
                        {value.toFixed(1)}
                      </span>

                      <div className="weight-bar-track">

                        <div
                          className="weight-bar"
                          style={{
                            height: `${height}%`,
                          }}
                        />

                      </div>

                      <small>
                        {index ===
                        weightPoints.length - 1
                          ? "Now"
                          : `W${index + 1}`}
                      </small>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>


        {/* ==========================================
             REAL REPORT COMPARISON
        ========================================== */}

        <section className="glass analyzer-card report-analyzer-card">

          <div className="analyzer-card-heading">

            <div className="analyzer-title">

              <span className="analyzer-icon teal-icon">
                <GitCompareArrows size={22} />
              </span>

              <div>

                <p className="eyebrow">
                  03 · Report comparison
                </p>

                <h2>
                  Previous vs new report
                </h2>

              </div>

            </div>


            <span className="demo-pill">
              AI powered
            </span>

          </div>


          {/* UPLOADS */}

          <div className="report-upload-grid">

            <label className="report-upload">

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(event) => {

                  setPreviousReport(
                    event.target.files?.[0] ||
                      null
                  );

                  setComparisonResult(null);
                  setComparisonError("");

                }}
              />

              <span className="upload-icon">
                <FileText size={21} />
              </span>

              <span className="upload-copy">

                <strong>
                  Previous report
                </strong>

                <small>
                  {previousReport
                    ? previousReport.name
                    : "JPG or PNG"}
                </small>

              </span>

              <span className="upload-action">
                Choose
              </span>

            </label>


            <label className="report-upload">

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(event) => {

                  setNewReport(
                    event.target.files?.[0] ||
                      null
                  );

                  setComparisonResult(null);
                  setComparisonError("");

                }}
              />

              <span className="upload-icon new-upload">
                <FileText size={21} />
              </span>

              <span className="upload-copy">

                <strong>
                  New report
                </strong>

                <small>
                  {newReport
                    ? newReport.name
                    : "JPG or PNG"}
                </small>

              </span>

              <span className="upload-action">
                Choose
              </span>

            </label>

          </div>


          {/* COMPARE BUTTON */}

          <button
            className="compare-button"
            disabled={
              !previousReport ||
              !newReport ||
              comparisonLoading
            }
            onClick={compareReports}
          >

            <GitCompareArrows size={19} />

            {comparisonLoading
              ? "Comparing Reports..."
              : "Compare Reports"}

          </button>


          {/* ERROR */}

          {comparisonError && (

            <div className="comparison-error">

              {comparisonError}

            </div>

          )}


          {/* LOADING */}

          {comparisonLoading && (

            <div className="comparison-demo-result">

              <div className="comparison-result-heading">

                <div>

                  <p className="eyebrow">
                    AI comparison
                  </p>

                  <h3>
                    Comparing your reports...
                  </h3>

                </div>

                <span className="demo-pill">
                  AI Working
                </span>

              </div>


              <p>
                CareHub is extracting both
                reports and comparing their
                results.
              </p>

            </div>

          )}


          {/* REAL RESULT */}

          {comparisonResult && (

            <div className="comparison-demo-result">

              <div className="comparison-result-heading">

                <div>

                  <p className="eyebrow">
                    AI comparison
                  </p>

                  <h3>
                    Previous → New
                  </h3>

                </div>

                <span className="demo-pill">
                  Real result
                </span>

              </div>


              <div className="analysis-result">

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  {
                    comparisonResult.comparison
                  }
                </pre>

              </div>


              <details>

                <summary>
                  View previous report OCR
                </summary>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                    lineHeight: "1.5",
                    marginTop: "12px",
                  }}
                >
                  {
                    comparisonResult.previousReportText
                  }
                </pre>

              </details>


              <details>

                <summary>
                  View new report OCR
                </summary>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                    lineHeight: "1.5",
                    marginTop: "12px",
                  }}
                >
                  {
                    comparisonResult.newReportText
                  }
                </pre>

              </details>


              <div className="camera-actions">

                <button
                  className="camera-secondary"
                  onClick={clearComparison}
                >
                  Clear comparison
                </button>

              </div>

            </div>

          )}


          {/* EMPTY STATE */}

          {!comparisonResult &&
            !comparisonLoading && (
              <div className="comparison-note">

                <CalendarDays size={18} />

                <span>
                  Upload two report images.
                  CareHub will use OCR + AI
                  to compare them.
                </span>

              </div>
            )}

        </section>

      </section>

    </main>
  );
}

/* =========================================================
   WATER PAGE
========================================================= */

function WaterPage({ water, onSetWater, onBack }) {

  const percentage =
    Math.min(
      (water / WATER_GOAL) * 100,
      100
    );

  const completedGlasses =
    Math.round(water / GLASS_SIZE);

  const remaining =
    Math.max(
      WATER_GOAL - water,
      0
    );

  return (
    <main className="app-shell water-app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <section className="phone water-phone">

        <header className="water-header">

          <button
            className="back-button glass-button"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft size={23} />
          </button>

          <div>
            <p className="eyebrow">
              Daily tracking
            </p>

            <h1>Water Intake</h1>
          </div>

          <div className="water-header-icon glass">
            <Droplets size={24} />
          </div>

        </header>


        <section className="water-card glass">

          <div
            className="water-circle"
            style={{
              "--water-level": `${percentage}%`,
            }}
          >

            <div className="water-fill">
              <span className="wave wave-one" />
              <span className="wave wave-two" />
            </div>

            <div className="water-circle-content">

              <strong>
                {Math.round(percentage)}%
              </strong>

              <span>
                completed
              </span>

            </div>

          </div>


          <div className="water-amount">

            <strong>
              <span>{water}</span> / {WATER_GOAL} ml
            </strong>

            <span>
              Daily goal 💧
            </span>

          </div>

        </section>


        <section className="glass log-water-card">

          <div className="log-heading">

            <div>
              <p className="eyebrow">
                Log your water
              </p>

              <h2>
                Tap a glass
              </h2>
            </div>

            <span className="glass-size">
              250 ml each
            </span>

          </div>


          <div
            className="glass-row"
            aria-label="Water glasses"
          >

            {Array.from(
              { length: GLASS_COUNT },
              (_, index) => {

                const glassNumber =
                  index + 1;

                const filled =
                  glassNumber <=
                  completedGlasses;

                return (
                  <button
                    key={glassNumber}
                    className={`water-glass ${
                      filled ? "filled" : ""
                    }`}
                    onClick={() =>
                      onSetWater(
                        glassNumber *
                          GLASS_SIZE
                      )
                    }
                    aria-label={`Log ${glassNumber} glasses`}
                  >

                    <span className="glass-outline">
                      <span className="glass-water" />
                    </span>

                    <small>
                      {glassNumber}
                    </small>

                  </button>
                );
              }
            )}

          </div>


          <div className="water-progress-text">

            <span>
              {completedGlasses} of{" "}
              {GLASS_COUNT} glasses
            </span>

            <strong>
              {remaining === 0
                ? "Goal reached! 🎉"
                : `${remaining} ml left`}
            </strong>

          </div>

        </section>


        <section className="glass hydration-tip">

          <div className="tip-icon">
            <Droplets size={22} />
          </div>

          <div>
            <strong>
              Keep sipping 💙
            </strong>

            <p>
              Small amounts throughout the day
              make tracking easier.
            </p>
          </div>

        </section>

      </section>
    </main>
  );
}


/* =========================================================
   WEIGHT PAGE
========================================================= */

function WeightPage({
  weight,
  setWeight,
  weightInput,
  setWeightInput,
  history,
  setHistory,
  onBack,
}) {

  const saveWeight = () => {

    const value =
      Number(weightInput);

    if (
      !Number.isFinite(value) ||
      value <= 0 ||
      value > 300
    ) {
      return;
    }

    setWeight(value);

    setHistory((items) => [
      {
        id: Date.now(),
        date: "Today",
        value,
      },

      ...items.filter(
        (item) =>
          item.date !== "Today"
      ),
    ]);

    setWeightInput("");
  };


  const removeEntry = (id) => {
    setHistory((items) =>
      items.filter(
        (item) => item.id !== id
      )
    );
  };


  const previous =
    history.find(
      (item) =>
        item.date !== "Today"
    );

  const difference =
    previous
      ? weight - previous.value
      : 0;


  return (
    <main className="app-shell weight-app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <section className="phone weight-phone">

        <header className="weight-header">

          <button
            className="back-button glass-button"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft size={23} />
          </button>

          <div>
            <p className="eyebrow">
              Daily tracking
            </p>

            <h1>
              Weight Log
            </h1>
          </div>

          <div className="weight-header-icon glass">
            <Scale size={24} />
          </div>

        </header>


        <section className="weight-card glass">

          <div className="weight-orb">

            <Scale size={34} />

            <strong>
              {weight.toFixed(1)}
            </strong>

            <span>
              kg
            </span>

          </div>


          <div className="weight-summary">

            <span className="status-pill">
              Current weight
            </span>

            <h2>
              {difference === 0
                ? "Your latest entry"
                : `${Math.abs(
                    difference
                  ).toFixed(1)} kg ${
                    difference > 0
                      ? "up"
                      : "down"
                  }`}
            </h2>

            <p>
              Keep your entries consistent
              so CareHub can show your
              progress over time.
            </p>

          </div>

        </section>


        <section className="glass weight-log-card">

          <div className="log-heading">

            <div>
              <p className="eyebrow">
                New entry
              </p>

              <h2>
                Log your weight
              </h2>
            </div>

            <Scale size={23} />

          </div>


          <div className="weight-input-row">

            <div className="weight-input-wrap">

              <input
                type="number"
                min="1"
                max="300"
                step="0.1"
                placeholder="e.g. 58.4"
                value={weightInput}
                onChange={(event) =>
                  setWeightInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) =>
                  event.key === "Enter" &&
                  saveWeight()
                }
              />

              <span>
                kg
              </span>

            </div>


            <button
              className="primary-button"
              onClick={saveWeight}
            >
              <Plus size={19} />
              Add
            </button>

          </div>

        </section>


        <section className="glass weight-history-card">

          <div className="log-heading">

            <div>
              <p className="eyebrow">
                Recent entries
              </p>

              <h2>
                Weight history
              </h2>
            </div>

          </div>


          <div className="weight-history-list">

            {history.map((item) => (

              <div
                className="weight-history-row"
                key={item.id}
              >

                <div className="history-date">

                  <span className="history-dot" />

                  <strong>
                    {item.date}
                  </strong>

                </div>


                <strong>
                  {item.value.toFixed(1)} kg
                </strong>


                <button
                  className="delete-weight"
                  onClick={() =>
                    removeEntry(item.id)
                  }
                  aria-label={`Delete ${item.date} entry`}
                >
                  <X size={17} />
                </button>

              </div>

            ))}

          </div>

        </section>


        <section className="glass weight-tip">

          <div className="tip-icon">
            <HeartPulse size={22} />
          </div>

          <div>

            <strong>
              Track, don't stress 💙
            </strong>

            <p>
              Daily changes are normal.
              Focus on your overall trend.
            </p>

          </div>

        </section>

      </section>

    </main>
  );
}


/* =========================================================
   HEALTH SCORE PAGE
========================================================= */

function HealthScorePage({
  water,
  weight,
  onBack,
}) {

  const waterScore =
    Math.min(
      (water / WATER_GOAL) * 100,
      100
    );

  const weightScore = 86;
  const activityScore = 78;
  const sleepScore = 82;

  const score = Math.round(
    waterScore * 0.3 +
      weightScore * 0.25 +
      activityScore * 0.2 +
      sleepScore * 0.25
  );

  const status =
    score >= 80
      ? "Good"
      : score >= 60
      ? "Fair"
      : "Needs attention";

  const categories = [
    ["Water", waterScore, Droplets],
    ["Weight", weightScore, Scale],
    ["Activity", activityScore, Activity],
    ["Sleep", sleepScore, HeartPulse],
  ];

  return (
    <main className="app-shell score-app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <section className="phone score-phone">

        <header className="score-header">

          <button
            className="back-button glass-button"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft size={23} />
          </button>

          <div>
            <p className="eyebrow">
              Wellness snapshot
            </p>

            <h1>
              Health Score
            </h1>
          </div>

          <div className="score-header-icon glass">
            <HeartPulse size={24} />
          </div>

        </header>


        <section className="score-hero glass">

          <div
            className="score-circle"
            style={{
              "--score": `${score}%`,
            }}
          >

            <div className="score-circle-inner">

              <span>
                YOUR SCORE
              </span>

              <strong>
                {score}
              </strong>

              <small>
                / 100
              </small>

            </div>

          </div>


          <div className="score-message">

            <span className="status-pill">
              {status} ✨
            </span>

            <h2>
              A quick look at your wellness
            </h2>

            <p>
              This score combines the simple
              tracking data available in CareHub.
              It is for demonstration and is not
              a medical diagnosis.
            </p>

          </div>

        </section>


        <section className="glass score-breakdown">

          <div className="log-heading">

            <div>
              <p className="eyebrow">
                Your snapshot
              </p>

              <h2>
                Health factors
              </h2>
            </div>

            <HeartPulse size={23} />

          </div>


          <div className="score-factor-list">

            {categories.map(
              ([name, value, Icon]) => (

                <div
                  className="score-factor"
                  key={name}
                >

                  <div className="score-factor-top">

                    <div className="score-factor-name">

                      <span className="score-factor-icon">
                        <Icon size={18} />
                      </span>

                      <strong>
                        {name}
                      </strong>

                    </div>

                    <strong>
                      {Math.round(value)}%
                    </strong>

                  </div>


                  <div className="score-bar">
                    <span
                      style={{
                        width: `${value}%`,
                      }}
                    />
                  </div>

                </div>

              )
            )}

          </div>

        </section>


        <section className="score-bottom-grid">

          <div className="glass score-stat-card">

            <span className="score-stat-icon">
              <Droplets size={20} />
            </span>

            <small>
              Water today
            </small>

            <strong>
              {water} ml
            </strong>

          </div>


          <div className="glass score-stat-card">

            <span className="score-stat-icon">
              <Scale size={20} />
            </span>

            <small>
              Current weight
            </small>

            <strong>
              {weight.toFixed(1)} kg
            </strong>

          </div>

        </section>


        <section className="glass score-tip">

          <div className="tip-icon">
            <Sparkles size={21} />
          </div>

          <div>

            <strong>
              Small habits add up 💙
            </strong>

            <p>
              Keep logging your daily activities
              to make your CareHub snapshot
              more useful.
            </p>

          </div>

        </section>

      </section>

    </main>
  );
}

/* =========================================================
   AI CHAT PAGE
========================================================= */

function AIChatPage({ onBack }) {

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I'm CareHub AI 💙 How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: message,
    };

    setMessages((items) => [
      ...items,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.message ||
          "AI chat failed."
        );
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.reply,
      };

      setMessages((items) => [
        ...items,
        aiMessage,
      ]);

    } catch (error) {

      console.error(
        "AI Chat error:",
        error
      );

      setMessages((items) => [
        ...items,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            "Sorry, I couldn't connect to CareHub AI right now. Please make sure the backend and Ollama are running.",
        },
      ]);

    } finally {

      setLoading(false);

    }
  };


  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }

  };


  return (
    <main className="app-shell">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <section className="phone">

        {/* HEADER */}

        <header className="camera-header">

          <button
            className="back-button glass-button"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft size={23} />
          </button>

          <div>

            <p className="eyebrow">
              CareHub
            </p>

            <h1>
              AI Health Chat
            </h1>

          </div>

          <div className="camera-header-icon glass">
            <MessageCircle size={23} />
          </div>

        </header>


        {/* CHAT AREA */}

        <section
          className="glass"
          style={{
            flex: 1,
            minHeight: "520px",
            maxHeight: "650px",
            overflowY: "auto",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >

          {messages.map((message) => (

            <div
              key={message.id}
              style={{
                display: "flex",
                justifyContent:
                  message.role === "user"
                    ? "flex-end"
                    : "flex-start",
              }}
            >

              <div
                style={{
                  maxWidth: "82%",
                  padding: "12px 15px",
                  borderRadius: "18px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",

                  background:
                    message.role === "user"
                      ? "rgba(74, 144, 226, 0.16)"
                      : "rgba(255, 255, 255, 0.72)",

                  border:
                    "1px solid rgba(255,255,255,0.7)",

                  color: "#243247",

                  boxShadow:
                    "0 8px 25px rgba(40, 60, 100, 0.06)",
                }}
              >

                {message.text}

              </div>

            </div>

          ))}


          {loading && (

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >

              <div
                style={{
                  padding: "12px 15px",
                  borderRadius: "18px",
                  background:
                    "rgba(255,255,255,0.72)",
                  color: "#607089",
                }}
              >
                CareHub AI is thinking... 🤔
              </div>

            </div>

          )}

        </section>


        {/* INPUT */}

        <section
          className="glass"
          style={{
            marginTop: "12px",
            padding: "12px",
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
          }}
        >

          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask CareHub anything..."
            rows={2}
            disabled={loading}
            style={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "inherit",
              fontSize: "15px",
              padding: "10px",
            }}
          />

          <button
            className="primary-button"
            onClick={sendMessage}
            disabled={
              loading ||
              !input.trim()
            }
            aria-label="Send message"
          >
            {loading ? "..." : "Send"}
          </button>

        </section>


        <p
          style={{
            fontSize: "12px",
            textAlign: "center",
            opacity: 0.65,
            marginTop: "10px",
          }}
        >
          AI-generated educational information only.
          For medical concerns, consult a qualified
          healthcare professional.
        </p>

      </section>

    </main>
  );
}


/* =========================================================
   CAMERA + REAL OCR + AI PAGE
========================================================= */

function CameraPage({ onBack }) {

  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [stream, setStream] =
    useState(null);

  const [image, setImage] =
    useState(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);


  useEffect(() => {

    return () => {
      stream
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );
    };

  }, [stream]);


  /* -------------------------
     START CAMERA
  ------------------------- */

  const startCamera = async () => {

    setError("");
    setResult(null);
    setSelectedFile(null);

    try {

      const media =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: "environment",
              },
            },
            audio: false,
          }
        );

      setStream(media);
      setImage(null);

      requestAnimationFrame(() => {

        if (videoRef.current) {

          videoRef.current.srcObject =
            media;

          videoRef.current
            .play()
            .catch(() => {});

        }

      });

    } catch {

      setError(
        "Camera access wasn't available. You can choose an image instead."
      );

      fileRef.current?.click();
    }
  };


  /* -------------------------
     CAPTURE CAMERA IMAGE
  ------------------------- */

  const captureImage = () => {

    if (!videoRef.current) {
      return;
    }

    const video =
      videoRef.current;

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      video.videoWidth || 1280;

    canvas.height =
      video.videoHeight || 720;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );


    canvas.toBlob(
      (blob) => {

        if (!blob) {
          setError(
            "Could not capture the image."
          );

          return;
        }

        const file =
          new File(
            [blob],
            "medical-report.jpg",
            {
              type: "image/jpeg",
            }
          );

        setSelectedFile(file);

        setImage(
          URL.createObjectURL(blob)
        );

        setResult(null);
        setError("");

      },
      "image/jpeg",
      0.9
    );


    stream
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    setStream(null);
  };


  /* -------------------------
     CHOOSE IMAGE
  ------------------------- */

  const chooseImage = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    setImage(
      URL.createObjectURL(file)
    );

    setResult(null);
    setError("");

    stream
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    setStream(null);
  };


  /* -------------------------
     REAL BACKEND AI ANALYSIS
  ------------------------- */

  const analyzeReport = async () => {

    if (!selectedFile) {

      setError(
        "Please capture or choose a report image first."
      );

      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const formData =
        new FormData();

      formData.append(
        "report",
        selectedFile
      );


      const response =
        await fetch(
          "http://localhost:5000/api/analyze-report",
          {
            method: "POST",
            body: formData,
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
            data.message ||
            "Report analysis failed."
        );
      }


      setResult(data);

    } catch (error) {

      console.error(
        "Report analysis error:",
        error
      );

      setError(
        error.message ||
          "Could not analyze report."
      );

    } finally {

      setLoading(false);
    }
  };


  /* -------------------------
     RETAKE
  ------------------------- */

  const retake = () => {

    setImage(null);
    setSelectedFile(null);
    setResult(null);
    setError("");

    startCamera();
  };


  return (
    <main className="app-shell camera-app">

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />


      <section className="phone camera-phone">

        <header className="camera-header">

          <button
            className="back-button glass-button"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft size={23} />
          </button>

          <div>

            <p className="eyebrow">
              CareHub
            </p>

            <h1>
              Camera Summarizer
            </h1>

          </div>

          <div className="camera-header-icon glass">
            <Camera size={23} />
          </div>

        </header>


        <section className="camera-view glass">

          {image ? (

            <img
              src={image}
              alt="Captured report"
              className="captured-image"
            />

          ) : stream ? (

            <video
              ref={videoRef}
              className="live-video"
              autoPlay
              playsInline
              muted
            />

          ) : (

            <div className="camera-empty">

              <div className="camera-big-icon">
                <Camera size={42} />
              </div>

              <h2>
                Capture a report
              </h2>

              <p>
                Take a clear photo of a
                medical report and CareHub
                will summarize it.
              </p>

            </div>

          )}


          {stream && (

            <button
              className="capture-button"
              onClick={captureImage}
              aria-label="Capture image"
            >
              <span />
            </button>

          )}

        </section>


        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={chooseImage}
        />


        {error && (
          <p className="camera-error">
            {error}
          </p>
        )}


        {!image && !stream && (

          <div className="camera-actions">

            <button
              className="camera-primary"
              onClick={startCamera}
            >
              <Camera size={19} />
              Open Camera
            </button>


            <button
              className="camera-secondary"
              onClick={() =>
                fileRef.current?.click()
              }
            >
              Choose Image
            </button>

          </div>

        )}


        {image && !result && (

          <section className="camera-result-panel glass">

            <span className="demo-pill">
              Ready for AI
            </span>

            <h2>
              Image captured successfully
            </h2>

            <p>
              Send the report to CareHub OCR
              and AI for analysis.
            </p>


            <div className="camera-actions">

              <button
                className="camera-secondary"
                onClick={retake}
                disabled={loading}
              >
                ↻ Retake
              </button>


              <button
                className="camera-primary"
                onClick={analyzeReport}
                disabled={loading}
              >
                {loading
                  ? "Analyzing..."
                  : "✨ Summarize"}
              </button>

            </div>

          </section>

        )}


        {loading && (

          <section className="camera-result-panel glass">

            <span className="demo-pill">
              AI Working
            </span>

            <h2>
              Analyzing your report...
            </h2>

            <p>
              CareHub is extracting the text
              and generating an AI summary.
              This may take a little while.
            </p>

          </section>

        )}


        {result && (

          <section className="camera-result-panel glass">

            <span className="demo-pill">
              AI Analysis
            </span>

            <h2>
              Report analyzed successfully 🎉
            </h2>


            <div className="analysis-result">

              <h3>
                AI Summary
              </h3>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  textAlign: "left",
                  lineHeight: "1.6",
                }}
              >
                {result.aiAnalysis}
              </pre>

            </div>


            <details>

              <summary>
                View extracted OCR text
              </summary>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  textAlign: "left",
                  lineHeight: "1.5",
                  marginTop: "12px",
                }}
              >
                {result.extractedText}
              </pre>

            </details>


            <div className="camera-actions">

              <button
                className="camera-secondary"
                onClick={retake}
              >
                ↻ Analyze Another
              </button>

            </div>

          </section>

        )}


        <section className="camera-tip glass">

          <span>
            💡
          </span>

          <div>

            <strong>
              For a better result
            </strong>

            <p>
              Use good lighting, keep the
              full page visible, and avoid blur.
            </p>

          </div>

        </section>

      </section>

    </main>
  );
}


export default App;