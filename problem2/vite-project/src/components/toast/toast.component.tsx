import { Toast, ToastContainer } from 'react-bootstrap';
import { useToast } from '../../contexts';

export const ToastComponent = () => {
  const { show, message, type, hideToast } = useToast();

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={hideToast} bg={type} className="text-white" autohide delay={3000}>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
