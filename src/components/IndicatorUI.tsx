// src/components/IndicatorUI.tsx

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface IndicatorUIProps {
    title?: string;
    description?: string;
}

export default function IndicatorUI(props: IndicatorUIProps) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h5" component="div">
                    {props.description}
                </Typography>
                <Typography variant="body2" component="p" color="text.secondary">
                    {props.title}
                </Typography>
            </CardContent>
        </Card>
    )
}
