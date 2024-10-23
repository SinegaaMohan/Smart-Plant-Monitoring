import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Card, CardContent, CircularProgress, List, ListItem, ListItemText, ListItemAvatar, Avatar,
  LinearProgress, Chip, Divider, Grid
} from '@mui/material';
import { CloudUpload, Clear, Refresh } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useTheme, useMediaQuery } from '@mui/material';

require('dotenv').config();

const AIPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pastSearches, setPastSearches] = useState([]);
  const [statistics, setStatistics] = useState({ total: 0, healthy: 0, unhealthy: 0 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sendFile = useCallback(async () => {
    if (selectedFile) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.post(process.env.VITE_REACT_APP_API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(res.data);
        if (res.status === 200) {
          const result = res.data;
          let classification;

          // Determine classification based on the response
          if (result.class === 'Pepper__bell___healthy') {
            classification = 'healthy';
          } else if (result.class === 'Pepper__bell___Bacterial_spot') {
            classification = 'unhealthy';
          } else {
            classification = 'unknown'; // Handle any unexpected classes
          }

          // Update the data state
          setData({ class: classification, accuracy: result.accuracy });

          // Update past searches
          setPastSearches(prevSearches => [
            { file: selectedFile, result: { class: classification, accuracy: result.accuracy }, timestamp: new Date().toLocaleString() },
            ...prevSearches.slice(0, 9)
          ]);

          // Update statistics based on classification
          updateStatistics(classification);
        }
      } catch (error) {
        console.error("Error uploading file", error);
        setError("An error occurred while processing the image.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedFile]);




  const clearData = () => {
    setData(null);
    setSelectedFile(null);
    setError(null);
  };

  const updateStatistics = (classResult) => {
    setStatistics(prev => ({
      total: prev.total + 1,
      healthy: classResult === 'healthy' ? prev.healthy + 1 : prev.healthy,
      unhealthy: classResult === 'unhealthy' ? prev.unhealthy + 1 : prev.unhealthy
    }));
  };

  const resetStatistics = () => {
    setStatistics({ total: 0, healthy: 0, unhealthy: 0 });
  };

  useEffect(() => {
    if (selectedFile) {
      sendFile();
    }
  }, [selectedFile, sendFile]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setData(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const renderResult = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 3, width: '96vw' }}>
      <Typography variant="h6" gutterBottom>Analysis Result</Typography>
      {selectedFile && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src={URL.createObjectURL(selectedFile)} alt="Analyzed" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </Box>
      )}
      <Typography variant="body1" gutterBottom>Label: <Chip label={data.class} color={data.class === 'healthy' ? 'success' : 'error'} /></Typography>
      <Typography variant="body1" gutterBottom>Confidence:</Typography>
      <LinearProgress variant="determinate" value={data.accuracy * 100} sx={{ mb: 1 }} />
      <Typography variant="body2">{(data.accuracy * 100).toFixed(2)}%</Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>Analyzed at: {new Date().toLocaleString()}</Typography>
      <Button
        variant="contained"
        onClick={clearData}
        startIcon={<Clear />}
        sx={{ mt: 2 }}
      >
        Clear Result
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', width: '100vw', p: 3 }}>
      <Typography variant="h4" gutterBottom>AgriAI: Bell Pepper Classifier (Beta model)</Typography>

      {data && renderResult()}

      <Card sx={{ width: '96vw', mb: 3 }}>
        <CardContent>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
              pointerEvents: isLoading ? 'none' : 'auto'
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {selectedFile ? selectedFile.name : "Drag and drop an image here, or click to select one"}
            </Typography>
          </Box>
        </CardContent>
        {isLoading && (
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Processing...</Typography>
          </CardContent>
        )}
        {error && (
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        )}
      </Card>

      <Grid container spacing={3} sx={{ width: '96vw' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Past Searches</Typography>
            <List>
              {pastSearches.map((search, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar src={URL.createObjectURL(search.file)} variant="rounded" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={search.result.class}
                    secondary={`Confidence: ${(search.result.accuracy * 100).toFixed(2)}% | ${search.timestamp}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Statistics</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">Total Analyses: {statistics.total}</Typography>
            <Typography variant="body1">Healthy: {statistics.healthy}</Typography>
            <Typography variant="body1">Unhealthy: {statistics.unhealthy}</Typography>
            <LinearProgress
              variant="determinate"
              value={(statistics.healthy / statistics.total) * 100 || 0}
              sx={{ mt: 2, mb: 1 }}
            />
            <Typography variant="body2">
              {((statistics.healthy / statistics.total) * 100 || 0).toFixed(2)}% Healthy
            </Typography>
            <Button
              variant="outlined"
              onClick={resetStatistics}
              startIcon={<Refresh />}
              sx={{ mt: 2 }}
            >
              Reset Statistics
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIPage;
