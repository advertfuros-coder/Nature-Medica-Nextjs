'use client';

import Snowfall from 'react-snowfall';

export default function SnowfallWrapper() {
    return (
        <Snowfall
            style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                zIndex: 50,
                pointerEvents: 'none'
            }}
            color="#fff"
            snowflakeCount={150}
            radius={[0.5, 2.5]}
            speed={[0.5, 2.0]}
            wind={[-0.5, 2.0]}
        />
    );
}
