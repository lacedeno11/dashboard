import Alert from '@mui/material/Alert';

interface AlertConfig {
  description: string;
}

function AlertUI({ config }: { config: AlertConfig }) {
  return (
    <Alert variant="standard" severity="success"> 
      {config.description}
    </Alert>
  );
}

export default AlertUI;