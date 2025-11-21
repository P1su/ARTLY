import ReactDOM from 'react-dom/client';
import Marker from '../components/Marker/Marker';

export const createMarkerElement = (title, isLike = false) => {
  const container = document.createElement('div');

  const root = ReactDOM.createRoot(container);
  root.render(<Marker title={title} isLike={isLike} />);

  return container;
};
