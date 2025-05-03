import React, { useState } from "react";
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
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

// Access API key from environment variable, with fallback
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const StyleButton = styled(ButtonBase)(({ theme }) => ({
  width: 60,
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
    id: "anime",
    label: "Anime Style",
    image: "https://cdn.pixabay.com/photo/2023/05/31/11/15/anime-8031586_1280.jpg",
  },
  {
    id: "realistic",
    label: "Realistic",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "cartoon",
    label: "Cartoon",
    image: "https://cdn.pixabay.com/photo/2023/02/09/16/36/cartoon-7779219_1280.jpg",
  },
  {
    id: "portrait",
    label: "Portrait",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash-exp-image-generation");
  const [preference, setPreference] = useState("speed");
  const [style, setStyle] = useState("default");
  const [shape, setShape] = useState("square");
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleModelChange = (event, newModel) => {
    if (newModel !== null) {
      setModel(newModel);
    }
  };

  const handlePreferenceChange = (event, newPreference) => {
    if (newPreference !== null) {
      setPreference(newPreference);
    }
  };

  const handleStyleChange = (styleId) => {
    setStyle(styleId);
  };

  const handleShapeChange = (shapeId) => {
    setShape(shapeId);
  };

  const generateImage = async () => {
    setGenerating(true);
    setError("");
    setImageUrl("");

    let fullPrompt = prompt.trim();

    // If prompt is empty, use a default prompt
    if (!fullPrompt) {
      fullPrompt = "Beautiful landscape with mountains and lake";
    }

    if (style !== "default") {
      fullPrompt += `, ${style} style`;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          }),
        }
      );

      const data = await res.json();
      console.log("API response:", data);

      // Find the first image part
      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(
        (p) => p.inlineData && p.inlineData.mimeType.startsWith("image/")
      );

      if (imagePart) {
        setImageUrl(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
      } else {
        setError("No image was generated. Try a different prompt or try again later.");
        console.error("No image found in response:", data);
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Please try again later.");
    } finally {
      setGenerating(false);
    }
  };

  // Improved download function without alerts
  const handleDownload = () => {
    if (!imageUrl) return;

    try {
      // Create a temporary anchor element for download
      const downloadLink = document.createElement("a");

      // For data URLs (base64 images from API)
      if (imageUrl.startsWith("data:")) {
        downloadLink.href = imageUrl;
        downloadLink.download = `ai-generated-image-${Date.now()}.png`;
      } else {
        // For external URLs
        downloadLink.href = imageUrl;
        downloadLink.download = `ai-generated-image-${Date.now()}.jpg`;
      }

      // Trigger download silently without alert
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  // Improved share function with better sharing options
  const handleShare = async () => {
    if (!imageUrl) return;

    try {
      // Try native Web Share API first (mobile devices)
      if (navigator.share) {
        // For sharing images properly
        try {
          // Fetch the image to convert to blob for better sharing
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], "dysonasi-image.png", { type: blob.type });

          // Share with image file attached
          await navigator.share({
            title: "AI Generated Image",
            text: `Check out this AI-generated image with prompt: "${prompt}"`,
            files: [file],
          });
        } catch (shareError) {
          // If file sharing fails, try URL sharing
          await navigator.share({
            title: "AI Generated Image",
            text: `Check out this AI-generated image with prompt: "${prompt}"`,
            url: imageUrl,
          });
        }
      } else {
        // For desktop browsers without Web Share API
        // Create a temporary textarea to copy link
        const textarea = document.createElement("textarea");
        textarea.value = imageUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        // Show small notification without blocking alert
        const notification = document.createElement("div");
        notification.textContent = "Image URL copied to clipboard!";
        notification.style.position = "fixed";
        notification.style.bottom = "20px";
        notification.style.left = "50%";
        notification.style.transform = "translateX(-50%)";
        notification.style.padding = "10px 20px";
        notification.style.backgroundColor = "rgba(0,0,0,0.7)";
        notification.style.color = "white";
        notification.style.borderRadius = "5px";
        notification.style.zIndex = "9999";

        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={3} mb={3}>
        <Card
          sx={{
            borderRadius: 3,
            backgroundColor: "transparent",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            overflow: "hidden",
            p: 3,
          }}
        >
          <MDTypography variant="h4" fontWeight="medium" textAlign="center" my={3}>
            AI Image Generator
          </MDTypography>
          <MDTypography variant="body2" color="text" textAlign="center" mb={4}>
            This is an AI Image Generator. It creates an image from scratch from a text description.
          </MDTypography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={imageUrl ? 6 : 12}>
              <MDBox mb={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={1}>
                  Create an image from text prompt
                </MDTypography>
                <TextField
                  fullWidth
                  placeholder="Enter your prompt or just click generate to get inspired"
                  multiline
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  sx={{ mb: 2, backgroundColor: "rgba(50, 50, 60, 0.2)", borderRadius: 2 }}
                  InputProps={{ style: { color: "white" } }}
                />
                <MDButton
                  variant="contained"
                  color="info"
                  onClick={generateImage}
                  disabled={generating}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(90deg, #8a3bf6 0%, #a758ff 100%)",
                  }}
                >
                  {generating ? <CircularProgress size={24} color="inherit" /> : "Generate"}
                </MDButton>
              </MDBox>

              <MDBox mb={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={1}>
                  Choose a model
                </MDTypography>
                <ToggleButtonGroup
                  value={model}
                  exclusive
                  onChange={handleModelChange}
                  aria-label="model selection"
                  sx={{ mb: 2, width: "100%" }}
                >
                  <ToggleButton
                    value="gemini-1.5-flash"
                    aria-label="standard"
                    sx={{
                      flex: 1,
                      py: 1.2,
                      backgroundColor: model === "gemini-1.5-flash" ? "#444" : "#222",
                      color: model === "gemini-1.5-flash" ? "#fff" : "#aaa",
                      borderColor: "#444",
                      fontWeight: model === "gemini-1.5-flash" ? "bold" : "normal",
                      border: model === "gemini-1.5-flash" ? "2px solid #8a3bf6" : "1px solid #444",
                    }}
                  >
                    Standard
                  </ToggleButton>
                  <ToggleButton
                    value="gemini-2.0-flash-exp-image-generation"
                    aria-label="hd"
                    sx={{
                      flex: 1,
                      py: 1.2,
                      backgroundColor:
                        model === "gemini-2.0-flash-exp-image-generation" ? "#444" : "#222",
                      color: model === "gemini-2.0-flash-exp-image-generation" ? "#fff" : "#aaa",
                      borderColor: "#444",
                      fontWeight:
                        model === "gemini-2.0-flash-exp-image-generation" ? "bold" : "normal",
                      border:
                        model === "gemini-2.0-flash-exp-image-generation"
                          ? "2px solid #8a3bf6"
                          : "1px solid #444",
                    }}
                  >
                    HD
                  </ToggleButton>
                </ToggleButtonGroup>
              </MDBox>

              <MDBox mb={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={1}>
                  Preference
                </MDTypography>
                <ToggleButtonGroup
                  value={preference}
                  exclusive
                  onChange={handlePreferenceChange}
                  aria-label="preference selection"
                  sx={{ mb: 2, width: "100%" }}
                >
                  <ToggleButton
                    value="speed"
                    aria-label="speed"
                    sx={{
                      flex: 1,
                      py: 1.2,
                      backgroundColor: preference === "speed" ? "#444" : "#222",
                      color: preference === "speed" ? "#fff" : "#aaa",
                      borderColor: "#444",
                      fontWeight: preference === "speed" ? "bold" : "normal",
                      border: preference === "speed" ? "2px solid #8a3bf6" : "1px solid #444",
                    }}
                  >
                    Speed
                  </ToggleButton>
                  <ToggleButton
                    value="quality"
                    aria-label="quality"
                    sx={{
                      flex: 1,
                      py: 1.2,
                      backgroundColor: preference === "quality" ? "#444" : "#222",
                      color: preference === "quality" ? "#fff" : "#aaa",
                      borderColor: "#444",
                      fontWeight: preference === "quality" ? "bold" : "normal",
                      border: preference === "quality" ? "2px solid #8a3bf6" : "1px solid #444",
                    }}
                  >
                    Quality
                  </ToggleButton>
                </ToggleButtonGroup>
              </MDBox>

              <MDBox mb={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={1}>
                  Choose a style
                </MDTypography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {styleOptions.map((option) => (
                    <Tooltip key={option.id} title={option.label} arrow placement="top">
                      <StyleButton
                        onClick={() => handleStyleChange(option.id)}
                        className={style === option.id ? "selected" : ""}
                      >
                        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                          <Avatar
                            src={option.image}
                            alt={option.label}
                            variant="rounded"
                            sx={{
                              width: "100%",
                              height: "100%",
                              filter: style === option.id ? "brightness(1.2)" : "brightness(0.9)",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              width: "100%",
                              padding: "4px 0",
                              backgroundColor:
                                style === option.id ? "rgba(138, 59, 246, 0.8)" : "rgba(0,0,0,0.6)",
                              textAlign: "center",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <MDTypography
                              variant="caption"
                              color="white"
                              fontWeight={style === option.id ? "bold" : "normal"}
                            >
                              {option.label.split(" ")[0]}
                            </MDTypography>
                          </Box>
                        </Box>
                      </StyleButton>
                    </Tooltip>
                  ))}
                </Box>
              </MDBox>
            </Grid>

            {imageUrl && (
              <Grid item xs={12} md={6}>
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  borderRadius={3}
                  overflow="hidden"
                  boxShadow="0 5px 15px rgba(0,0,0,0.2)"
                >
                  <img
                    src={imageUrl}
                    alt="Generated"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "580px",
                      objectFit: "contain",
                      borderRadius: "16px",
                    }}
                  />
                  <MDBox mt={2} display="flex" width="100%" justifyContent="center" gap={2}>
                    <MDButton variant="outlined" color="info" onClick={handleDownload}>
                      Download
                    </MDButton>
                    <MDButton variant="contained" color="info" onClick={handleShare}>
                      Share
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Grid>
            )}
          </Grid>

          {error && (
            <MDBox mt={2}>
              <MDTypography variant="body2" color="error" textAlign="center">
                {error}
              </MDTypography>
            </MDBox>
          )}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
