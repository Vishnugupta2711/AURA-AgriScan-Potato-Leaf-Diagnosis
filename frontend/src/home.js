import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
  withStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import ClearIcon from "@material-ui/icons/Clear";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoIcon from "@material-ui/icons/Info";
import LocalPharmacyIcon from "@material-ui/icons/LocalPharmacy";
import EcoIcon from "@material-ui/icons/Eco";
import WarningIcon from "@material-ui/icons/Warning";
import cblogo from "./cblogo.PNG";
import bgImage from "./bg.png";
import axios from "axios";
import "./home.css";
import "./style.css"; // Import the new style.css file

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  appbar: {
    background: "#3e7a45", // Updated to match our CSS variables
    boxShadow: "none",
    color: "white",
  },
  mainContainer: {
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    minHeight: "93vh",
    marginTop: "8px",
    padding: theme.spacing(2),
  },
  imageCard: {
    maxWidth: 500,
    margin: "auto",
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.95)",
    boxShadow: theme.shadows[10],
  },
  button: {
    margin: theme.spacing(1),
  },
  loader: {
    color: "#3e7a45",
    marginTop: theme.spacing(2),
  },
  tableCell: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  solutionCard: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing(2),
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.95)",
    boxShadow: theme.shadows[5],
  },
  accordionHeading: {
    fontSize: 16,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
  },
  accordionIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  healthyMessage: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    margin: theme.spacing(2),
  },
  warningBox: {
    backgroundColor: "rgba(255, 244, 229, 0.9)",
    padding: theme.spacing(2),
    borderRadius: 8,
    marginTop: theme.spacing(2),
    borderLeft: "4px solid #FFB74D",
  },
}));

const ColorButton = withStyles(() => ({
  root: {
    color: "#ffffff",
    backgroundColor: "#3e7a45",
    "&:hover": {
      backgroundColor: "#2a5730",
    },
  },
}))(Button);

// Disease information database
const diseaseInfo = {
  Potato___Early_blight: {
    description:
      "Early blight is a common fungal disease caused by Alternaria solani. It appears as dark brown to black lesions with concentric rings, creating a 'bull's-eye' pattern on lower/older leaves first.",
    chemicalSolutions: [
      "Apply fungicides containing chlorothalonil, mancozeb, or copper-based products every 7-10 days.",
      "Alternate between different fungicide groups to prevent resistance.",
      "Begin applications when plants are 6-8 inches tall or when disease first appears.",
    ],
    organicSolutions: [
      "Apply copper-based organic fungicides or neem oil.",
      "Use compost tea spray to strengthen plant resistance.",
      "Remove and destroy infected leaves immediately.",
    ],
    preventiveMeasures: [
      "Use certified disease-free seed potatoes.",
      "Practice crop rotation (3-4 year cycle).",
      "Space plants properly for good air circulation.",
      "Water at the base of plants in the morning so leaves can dry during the day.",
      "Mulch around plants to prevent soil splash onto leaves.",
    ],
  },
  Potato___Late_blight: {
    description:
      "Late blight is a devastating disease caused by Phytophthora infestans. It spreads rapidly in cool, wet weather and can destroy entire fields within days. It appears as dark, water-soaked lesions that quickly enlarge and can affect all parts of the plant.",
    chemicalSolutions: [
      "Apply preventive fungicides containing chlorothalonil, mancozeb, or metalaxyl before disease appears.",
      "During high-risk periods, spray every 5-7 days.",
      "Use systemic fungicides for curative treatment if disease is detected.",
    ],
    organicSolutions: [
      "Apply copper-based fungicides approved for organic farming.",
      "Use diluted hydrogen peroxide spray (1:10 ratio) for early infections.",
      "Remove infected plants immediately and dispose away from garden areas.",
    ],
    preventiveMeasures: [
      "Plant resistant varieties when available.",
      "Avoid overhead irrigation and water early in the day.",
      "Increase plant spacing to improve air circulation.",
      "Monitor weather forecasts and apply preventive sprays before wet periods.",
      "Destroy all plant debris after harvest.",
    ],
  },
  Potato___healthy: {
    tips: [
      "Continue regular monitoring for early signs of disease.",
      "Maintain consistent watering schedule - about 1-2 inches per week.",
      "Apply balanced fertilization - avoid excess nitrogen which can make plants susceptible to disease.",
      "Hill soil around plants as they grow to prevent greening of tubers.",
      "Consider applying preventive treatments during high-risk weather conditions.",
    ],
  },
};

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let confidence = data ? (parseFloat(data.confidence) * 100).toFixed(2) : null;

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    const sendFile = async () => {
      if (!selectedFile) return;
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const res = await axios.post(process.env.REACT_APP_API_URL, formData);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (preview) {
      sendFile();
    }
  }, [preview, selectedFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      setData(null);
      return;
    }
    setSelectedFile(files[0]);
    setData(null);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
  };

  const renderSolutions = () => {
    if (!data || !data.class) return null;

    // Normalize the disease class for consistent lookup
    const rawDiseaseClass = data.class;
    // Handle different possible formats - some APIs might return with underscores, some without
    let normalizedClass = rawDiseaseClass;

    // First try exact match
    if (!diseaseInfo[normalizedClass]) {
      // Try standard format with underscores
      if (normalizedClass.indexOf("Potato___") === -1) {
        normalizedClass = `Potato___${normalizedClass.replace(/\s+/g, "_")}`;
      }

      // If still not found, try different variations
      if (!diseaseInfo[normalizedClass]) {
        if (
          normalizedClass.toLowerCase().includes("early") ||
          normalizedClass.toLowerCase().includes("blight")
        ) {
          normalizedClass = "Potato___Early_blight";
        } else if (normalizedClass.toLowerCase().includes("late")) {
          normalizedClass = "Potato___Late_blight";
        } else if (normalizedClass.toLowerCase().includes("healthy")) {
          normalizedClass = "Potato___healthy";
        } else {
          // If we can't identify the disease, show a generic message
          return (
            <Card className={classes.solutionCard}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  style={{ color: "#3e7a45", marginBottom: 16 }}
                >
                  Disease Information
                </Typography>
                <Typography variant="body1">
                  Information for this specific disease classification (
                  {rawDiseaseClass}) is not available in our database. Please
                  consult with a local agricultural expert for diagnosis and
                  treatment recommendations.
                </Typography>
              </CardContent>
            </Card>
          );
        }
      }
    }

    const info = diseaseInfo[normalizedClass];

    // Safety check - if info is still undefined, provide a fallback
    if (!info) {
      return (
        <Card className={classes.solutionCard}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              style={{ color: "#3e7a45", marginBottom: 16 }}
            >
              Disease Information
            </Typography>
            <Typography variant="body1">
              Information for this classification is currently unavailable.
              Please consult with a local agricultural expert.
            </Typography>
          </CardContent>
        </Card>
      );
    }

    if (normalizedClass === "Potato___healthy") {
      return (
        <Card className={classes.solutionCard}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              className={classes.healthyMessage}
            >
              Good News! Your potato plant is healthy.
            </Typography>

            <Divider className={classes.divider} />

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.accordionHeading}>
                  <EcoIcon className={classes.accordionIcon} />
                  Maintenance Tips
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {info.tips.map((tip, index) => (
                    <Typography key={index} paragraph>
                      • {tip}
                    </Typography>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      );
    }

    // Check if all required fields exist before rendering
    const hasDescription = info && info.description;
    const hasChemicalSolutions =
      info && info.chemicalSolutions && info.chemicalSolutions.length > 0;
    const hasOrganicSolutions =
      info && info.organicSolutions && info.organicSolutions.length > 0;
    const hasPreventiveMeasures =
      info && info.preventiveMeasures && info.preventiveMeasures.length > 0;

    const displayName = normalizedClass
      .replace("Potato___", "")
      .replace(/_/g, " ");

    return (
      <Card className={classes.solutionCard}>
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            style={{ color: "#3e7a45", marginBottom: 16 }}
          >
            Disease Information & Solutions
          </Typography>

          <Paper className={classes.warningBox}>
            <Typography
              variant="body1"
              style={{ display: "flex", alignItems: "center" }}
            >
              <WarningIcon style={{ marginRight: 8, color: "#F57C00" }} />
              Consult with a local agricultural expert for specific
              recommendations suitable for your region.
            </Typography>
          </Paper>

          {hasDescription && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.accordionHeading}>
                  <InfoIcon className={classes.accordionIcon} />
                  About {displayName}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{info.description}</Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {hasChemicalSolutions && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.accordionHeading}>
                  <LocalPharmacyIcon className={classes.accordionIcon} />
                  Chemical Solutions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {info.chemicalSolutions.map((solution, index) => (
                    <Typography key={index} paragraph>
                      • {solution}
                    </Typography>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          )}

          {hasOrganicSolutions && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.accordionHeading}>
                  <EcoIcon className={classes.accordionIcon} />
                  Organic Solutions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {info.organicSolutions.map((solution, index) => (
                    <Typography key={index} paragraph>
                      • {solution}
                    </Typography>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          )}

          {hasPreventiveMeasures && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.accordionHeading}>
                  <InfoIcon className={classes.accordionIcon} />
                  Preventive Measures
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {info.preventiveMeasures.map((measure, index) => (
                    <Typography key={index} paragraph>
                      • {measure}
                    </Typography>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            AURA + : AgriScan: Potato Leaf Diagnosis
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo} />
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} className={classes.mainContainer}>
        <Card className={classes.imageCard}>
          <CardContent>
            <DropzoneArea
              acceptedFiles={["image/*"]}
              dropzoneText={"Drag & drop an image or click to select"}
              onChange={onSelectFile}
              filesLimit={1}
              showAlerts={false}
            />

            {isLoading && <CircularProgress className={classes.loader} />}

            {preview && !isLoading && (
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", marginTop: 16, borderRadius: 10 }}
              />
            )}

            {data && (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableCell}>
                          Disease
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          Confidence
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {data.class
                            .replace("Potato___", "")
                            .replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>{confidence}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            <Grid container justifyContent="center" style={{ marginTop: 16 }}>
              <ColorButton
                variant="contained"
                className={classes.button}
                startIcon={<ClearIcon />}
                onClick={clearAll}
              >
                Clear
              </ColorButton>
            </Grid>
          </CardContent>
        </Card>

        {data && renderSolutions()}
      </Container>
    </>
  );
};
