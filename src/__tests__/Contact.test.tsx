import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Contact } from '../components/Contact';

// Mock do fetch global
global.fetch = vi.fn();

describe('Contact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o formulário de contato corretamente', () => {
    render(<Contact />);

    expect(screen.getByText('Contato')).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail para retorno/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/escreva sua mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('mostra erro de validação para e-mail inválido', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const emailInput = screen.getByLabelText(/e-mail para retorno/i);
    const messageInput = screen.getByLabelText(/escreva sua mensagem/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(emailInput, 'email-invalido');
    await user.type(messageInput, 'Esta é uma mensagem de teste válida');
    await user.click(submitButton);

    expect(screen.getByText(/por favor, insira um e-mail válido/i)).toBeInTheDocument();
  });

  it('mostra erro de validação para mensagem muito curta', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const emailInput = screen.getByLabelText(/e-mail para retorno/i);
    const messageInput = screen.getByLabelText(/escreva sua mensagem/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(emailInput, 'teste@email.com');
    await user.type(messageInput, 'curta');
    await user.click(submitButton);

    expect(screen.getByText(/a mensagem deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
  });

  it('envia o formulário com dados válidos', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: 'true' })
    } as Response);

    render(<Contact />);

    const emailInput = screen.getByLabelText(/e-mail para retorno/i);
    const messageInput = screen.getByLabelText(/escreva sua mensagem/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(emailInput, 'teste@email.com');
    await user.type(messageInput, 'Esta é uma mensagem de teste válida');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/mensagem enviada com sucesso/i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://formsubmit.co/ajax/viniciusfv.9@gmail.com',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
    );
  });

  it('mostra erro quando o envio falha', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Contact />);

    const emailInput = screen.getByLabelText(/e-mail para retorno/i);
    const messageInput = screen.getByLabelText(/escreva sua mensagem/i);
    const submitButton = screen.getByRole('button', { name: /enviar/i });

    await user.type(emailInput, 'teste@email.com');
    await user.type(messageInput, 'Esta é uma mensagem de teste válida');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/falha na comunicação/i)).toBeInTheDocument();
    });
  });
});
