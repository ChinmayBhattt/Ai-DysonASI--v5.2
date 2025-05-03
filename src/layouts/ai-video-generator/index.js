import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";

// Access API key from environment variable, with fallback
const STABILITY_API_KEY =
  process.env.REACT_APP_STABILITY_API_KEY || "sk-SqDUh1M5X6NlBNtKfq4FlDk0p6yBkrE7L31yuGnofH4nEfBa";

// API endpoint - use the proxy server to avoid CORS issues
const API_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "/api/video/generate"
    : "http://localhost:5000/api/video/generate";

const StyleButton = styled(ButtonBase)(({ theme }) => ({
  width: 100,
  height: 60,
  borderRadius: 12,
  overflow: "hidden",
  margin: "0 5px",
  border: "2px solid transparent",
  "&.selected": {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: "0 0 15px rgba(138, 59, 246, 0.5)",
    transform: "scale(1.05)",
  },
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  },
}));

const styleOptions = [
  {
    id: "default",
    label: "Default",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "3d-animation",
    label: "3D Animation",
    image:
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "anime",
    label: "Anime",
    image: "https://cdn.pixabay.com/photo/2023/05/31/11/15/anime-8031586_1280.jpg",
  },
];

const durationOptions = [
  {
    id: "short",
    label: "Short (2-4s)",
    value: 2,
  },
  {
    id: "medium",
    label: "Medium (4-6s)",
    value: 4,
  },
  {
    id: "long",
    label: "Long (8-12s)",
    value: 8,
  },
];

export default function AIVideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [style, setStyle] = useState("default");
  const [duration, setDuration] = useState("short");
  const [quality, setQuality] = useState("standard");
  const [progress, setProgress] = useState(0);
  const [generationState, setGenerationState] = useState("");
  const videoRef = useRef(null);
  const progressTimerRef = useRef(null);

  // Function to simulate progress updates
  useEffect(() => {
    if (loading) {
      let currentProgress = 0;
      // Clear any existing timer
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }

      const progressStates = [
        "Preparing prompt...",
        "Initializing model...",
        "Generating video frames...",
        "Rendering video...",
        "Processing frames...",
        "Finalizing video...",
      ];

      // Create a new timer to update progress
      progressTimerRef.current = setInterval(() => {
        // Use variable increment to simulate slower generation at certain points
        const increment = currentProgress < 40 ? 1.5 : currentProgress < 80 ? 0.5 : 0.2;

        currentProgress += increment;

        // Update the generation state based on progress
        const stateIndex = Math.min(
          Math.floor((currentProgress / 100) * progressStates.length),
          progressStates.length - 1
        );
        setGenerationState(progressStates[stateIndex]);

        // Update progress value
        setProgress(Math.min(Math.round(currentProgress), 99)); // Cap at 99 until complete

        // If progress is complete, clear the timer
        if (currentProgress >= 99) {
          clearInterval(progressTimerRef.current);
        }
      }, 150);

      return () => {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
      };
    } else {
      // When loading is done, set progress to 100
      if (progress > 0) {
        setProgress(100);
        setGenerationState("Video generation complete!");
        // Reset progress after a short delay
        setTimeout(() => {
          setProgress(0);
          setGenerationState("");
        }, 2000);
      }
    }
  }, [loading, progress]);

  const handleStyleChange = (styleId) => {
    setStyle(styleId);
  };

  const handleDurationChange = (durationId) => {
    setDuration(durationId);
  };

  const handleQualityChange = (event, newQuality) => {
    if (newQuality !== null) {
      setQuality(newQuality);
    }
  };

  const generateVideo = async () => {
    setLoading(true);
    setError("");
    setVideoUrl("");
    setProgress(0);
    setGenerationState("Preparing prompt...");

    // TEMPORARY: Always use mock data until server is properly set up
    const useMockData = true;

    try {
      if (useMockData) {
        // Mock response for demonstration - using a more reliable video URL
        setGenerationState("Generating video frames...");
        setTimeout(() => {
          // Using multiple fallback options
          const videoOptions = [
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          ];

          setVideoUrl(videoOptions[Math.floor(Math.random() * videoOptions.length)]);
          setLoading(false);
        }, 5000); // Make it longer so progress is visible
        return;
      }

      const textPrompt = prompt.trim() || "Beautiful landscape with mountains and a lake";
      const selectedDuration = durationOptions.find((option) => option.id === duration).value;

      // Enhance prompt with style if not default
      let enhancedPrompt = textPrompt;
      if (style !== "default") {
        enhancedPrompt = `${textPrompt}, in ${style} style`;
      }

      // Create request config - directly using Stability API
      setGenerationState("Initializing model...");

      try {
        setGenerationState("Sending request to Stability AI...");
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            style,
            duration: selectedDuration,
            quality,
          }),
        });

        if (!response.ok) {
          setGenerationState("Error processing request...");
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `API Error: ${response.status} ${response.statusText}`
          );
        }

        setGenerationState("Processing response from Stability AI...");
        const data = await response.json();
        console.log("API response:", data);

        if (data.video_url) {
          setGenerationState("Loading generated video...");
          setVideoUrl(data.video_url);
        } else if (data.artifacts && data.artifacts.length > 0 && data.artifacts[0].url) {
          // Alternative response format
          setGenerationState("Loading generated video...");
          setVideoUrl(data.artifacts[0].url);
        } else {
          setError("No video was generated. Please try again with a different prompt.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error generating video:", err);

        // More helpful error messages for common issues
        if (err.message?.includes("401")) {
          setError("Authentication error: Please check your API key.");
        } else if (err.message?.includes("429")) {
          setError("Rate limit exceeded: Too many requests. Please try again later.");
        } else if (err.message?.includes("500")) {
          setError("Server error: Stability AI is experiencing issues. Please try again later.");
        } else if (err.message?.includes("503")) {
          setError(
            "Service unavailable: Stability AI service is currently down. Please try again later."
          );
        } else if (err.message?.includes("CORS")) {
          setError(
            "CORS error: Cannot access the API directly from browser. Try our server proxy instead."
          );
        } else {
          setError(`Failed to generate video: ${err.message}`);
        }

        setLoading(false);
      }
    } catch (err) {
      // This catch block is for any other errors outside the API call
      console.error("Unexpected error:", err);
      setError(`An unexpected error occurred: ${err.message}`);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      // Fetch the video data
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element for download
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `ai-generated-video-${Date.now()}.mp4`;

      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Release the URL
      window.URL.revokeObjectURL(url);

      // Show success notification
      showNotification("Video downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      showNotification("Failed to download video", true);
    }
  };

  const handleShare = async () => {
    if (!videoUrl) return;

    try {
      // Try native Web Share API first
      if (navigator.share) {
        await navigator.share({
          title: "AI Generated Video",
          text: `Check out this AI-generated video with prompt: "${prompt}"`,
          url: videoUrl,
        });
        return;
      }

      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(videoUrl);
      showNotification("Video URL copied to clipboard!");
    } catch (error) {
      console.error("Share error:", error);
      showNotification("Failed to share video", true);
    }
  };

  // Simple notification
  const showNotification = (message, isError = false) => {
    // This is a placeholder - you can implement a proper notification system
    console.log(message);
    // Alert for now (not ideal, but works for quick demo)
    if (isError) {
      alert(`Error: ${message}`);
    } else {
      alert(message);
    }
  };

  // Progress bar styling
  const progressColor = (value) => {
    if (value < 30) return "info";
    if (value < 70) return "warning";
    return "success";
  };

  // Function to create the style box
  const renderStyleLabel = (option) => (
    <Tooltip title={option.label} key={option.id}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          src={option.image}
          alt={option.label}
          variant="rounded"
          sx={avatarStyle(style === option.id)}
        />
        <MDTypography
          variant="caption"
          sx={{
            fontSize: "0.75rem",
            color: style === option.id ? "rgba(0, 0, 0, 0.9)" : "rgba(100, 100, 100, 0.9)",
            mt: 1,
            fontWeight: style === option.id ? 700 : 400,
          }}
        >
          {option.label}
        </MDTypography>
      </Box>
    </Tooltip>
  );

  // Styling for label boxes
  const styleLabelBoxStyle = (isSelected) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    border: isSelected ? "2px solid #8a3bf6" : "2px solid transparent",
    borderRadius: "8px",
    backgroundColor: isSelected ? "rgba(138, 59, 246, 0.1)" : "transparent",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(138, 59, 246, 0.05)",
    },
  });

  // Avatar styling
  const avatarStyle = (isSelected) => ({
    width: 48,
    height: 48,
    border: isSelected ? "2px solid #8a3bf6" : "2px solid transparent",
    boxShadow: isSelected ? "0 0 10px rgba(138, 59, 246, 0.5)" : "none",
    transition: "all 0.3s ease",
  });

  // Determine whether to show controls and video side-by-side or stacked
  const showSideBySide = videoUrl !== "";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <Card
          sx={{
            overflow: "visible",
            background: "linear-gradient(195deg, rgb(255, 255, 255), rgb(240, 240, 240))",
            color: "#333",
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <MDBox mb={3}>
            <MDTypography variant="h3" color="dark" fontWeight="medium">
              Text To-Video
            </MDTypography>
            <MDTypography variant="body2" color="text" opacity={0.8}>
              Generate realistic videos from text prompts using Stability AI
            </MDTypography>
          </MDBox>

          {progress > 0 && (
            <MDBox mb={3}>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={progressColor(progress)}
                sx={{ mb: 1, height: 8, borderRadius: 5 }}
              />
              <MDTypography variant="button" color="dark" fontWeight="light">
                {generationState} {progress}%
              </MDTypography>
            </MDBox>
          )}

          {error && (
            <MDBox
              mb={3}
              p={2}
              borderRadius={2}
              bgcolor="rgba(220, 53, 69, 0.1)"
              border="1px solid rgba(220, 53, 69, 0.3)"
            >
              <MDTypography variant="button" color="error" fontWeight="medium">
                {error}
              </MDTypography>
            </MDBox>
          )}

          <Grid container spacing={3}>
            {/* Controls section - takes full width if no video, otherwise takes left half */}
            <Grid item xs={12} md={showSideBySide ? 6 : 12}>
              <MDBox mb={3}>
                <TextField
                  fullWidth
                  placeholder="Enter your prompt or click generate to get inspired"
                  multiline
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  sx={{
                    mb: 2,
                    backgroundColor: "rgba(245, 245, 245, 0.8)",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(138, 59, 246, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(138, 59, 246, 0.5)",
                      },
                    },
                  }}
                  InputProps={{ style: { color: "#333" } }}
                />
                <MDButton
                  variant="contained"
                  color="info"
                  onClick={generateVideo}
                  disabled={loading}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(90deg, #8a3bf6 0%, #a758ff 100%)",
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Generate"}
                </MDButton>
              </MDBox>

              {/* Video Quality */}
              <MDBox mb={3}>
                <MDTypography variant="h6" color="dark" mb={2}>
                  Video Quality
                </MDTypography>
                <ToggleButtonGroup
                  value={quality}
                  exclusive
                  onChange={handleQualityChange}
                  aria-label="video quality"
                  fullWidth
                  sx={{
                    backgroundColor: "rgba(245, 245, 245, 0.8)",
                    borderRadius: 2,
                    border: "1px solid rgba(138, 59, 246, 0.2)",
                    "& .MuiToggleButton-root": {
                      color: "#333",
                      border: "none",
                      "&.Mui-selected": {
                        backgroundColor: "rgba(138, 59, 246, 0.5)",
                        color: "white",
                      },
                    },
                  }}
                >
                  <ToggleButton value="standard" aria-label="standard quality">
                    Standard
                  </ToggleButton>
                  <ToggleButton value="hd" aria-label="HD quality">
                    HD
                  </ToggleButton>
                  <ToggleButton value="max" aria-label="Maximum quality">
                    Max
                  </ToggleButton>
                </ToggleButtonGroup>
              </MDBox>

              {/* Duration Options */}
              <MDBox mb={3}>
                <MDTypography variant="h6" color="dark" mb={2}>
                  Video Duration
                </MDTypography>
                <Grid container spacing={2}>
                  {durationOptions.map((option) => (
                    <Grid item xs={4} key={option.id}>
                      <MDBox
                        onClick={() => handleDurationChange(option.id)}
                        sx={{
                          backgroundColor:
                            duration === option.id
                              ? "rgba(138, 59, 246, 0.5)"
                              : "rgba(245, 245, 245, 0.8)",
                          p: 2,
                          borderRadius: 2,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                          border: "1px solid rgba(138, 59, 246, 0.2)",
                          "&:hover": {
                            backgroundColor: "rgba(138, 59, 246, 0.3)",
                          },
                        }}
                      >
                        <MDTypography
                          variant="button"
                          color={duration === option.id ? "white" : "dark"}
                          fontWeight={duration === option.id ? "medium" : "light"}
                        >
                          {option.label}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  ))}
                </Grid>
              </MDBox>

              {/* Style Selection */}
              <MDBox mb={showSideBySide ? 0 : 3}>
                <MDTypography variant="h6" color="dark" mb={2}>
                  Choose a style
                </MDTypography>
                <Grid container spacing={2}>
                  {styleOptions.map((option) => (
                    <Grid item xs={showSideBySide ? 6 : 3} sm={3} key={option.id}>
                      <Box
                        onClick={() => handleStyleChange(option.id)}
                        sx={{
                          ...styleLabelBoxStyle(style === option.id),
                          border:
                            style === option.id
                              ? "2px solid #8a3bf6"
                              : "1px solid rgba(138, 59, 246, 0.2)",
                          backgroundColor:
                            style === option.id
                              ? "rgba(138, 59, 246, 0.1)"
                              : "rgba(245, 245, 245, 0.8)",
                        }}
                      >
                        <Avatar
                          src={option.image}
                          variant="rounded"
                          sx={{
                            width: "100%",
                            height: 80,
                            borderRadius: 2,
                            mb: 1,
                            border: style === option.id ? "2px solid #8a3bf6" : "none",
                          }}
                        />
                        <MDTypography
                          variant="caption"
                          color="dark"
                          fontWeight={style === option.id ? "medium" : "light"}
                        >
                          {option.label}
                        </MDTypography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </MDBox>
            </Grid>

            {/* Video Display - only shows when video is available */}
            {videoUrl && (
              <Grid item xs={12} md={6}>
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  borderRadius={3}
                  overflow="hidden"
                  boxShadow="0 5px 15px rgba(0,0,0,0.1)"
                  border="1px solid rgba(138, 59, 246, 0.2)"
                >
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "#fff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(138, 59, 246, 0.1)",
                    }}
                  >
                    <video
                      ref={videoRef}
                      key={videoUrl}
                      src={videoUrl}
                      controls
                      autoPlay
                      muted
                      playsInline
                      loop
                      width="100%"
                      height="auto"
                      preload="auto"
                      style={{
                        display: "block",
                        maxHeight: "580px",
                      }}
                      onError={(e) => {
                        console.error("Video error:", e);
                        setError("Failed to load video. Please try again.");
                      }}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Box>

                  <MDBox
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    width="100%"
                    mt={2}
                    px={1}
                  >
                    <MDButton
                      variant="outlined"
                      color="info"
                      onClick={handleDownload}
                      sx={{ mr: 2, flex: 1 }}
                    >
                      DOWNLOAD
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={handleShare}
                      sx={{ flex: 1 }}
                    >
                      SHARE
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="error"
                      onClick={() => setVideoUrl("")}
                      sx={{ ml: 2, flex: 1 }}
                    >
                      REGENERATE
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Grid>
            )}
          </Grid>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
