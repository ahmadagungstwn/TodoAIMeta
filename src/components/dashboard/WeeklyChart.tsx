import { weeklyIdeas } from '../../lib/mock-data';

export function WeeklyChart() {
  return (
    <>
      {weeklyIdeas.map((item) => {
        const isKam = item.day === 'Kam';
        return (
          <div
            key={item.day}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
              flexBasis: '0%',
              gap: '6px'
            }}
          >
            <div
              style={{
                width: '100%',
                height: item.value,
                borderRadius: '6px',
                flexShrink: 0,
                backgroundColor: isKam ? '#7C5CFC' : '#E8E4F0'
              }}
            />
            <div
              style={{
                fontSize: '11px',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontWeight: isKam ? 600 : 500,
                color: isKam ? '#7C5CFC' : '#8E8A9A',
                textAlign: 'center'
              }}
            >
              {item.day}
            </div>
          </div>
        );
      })}
    </>
  );
}
