import { useState } from 'react';
import './Contact.css';

export function Contact() {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Substitua pela sua chave do Web3Forms futuramente se quiser esconder, 
    // mas chaves do Web3Forms são públicas por design.
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE"); 

    setStatus('Enviando...');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('Mensagem enviada com sucesso! O Otto agradece.');
        form.reset();
      } else {
        setStatus('Erro ao enviar. Tente novamente mais tarde.');
      }
    } catch (err) {
      setStatus('Falha na comunicação. O sistema está offline?');
    }
  };

  return (
    <section className="contact-section section" id="contato">
      <div className="main-container">
        <h2 className="section-title">Inicie uma Conexão</h2>
        
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Terminal de Comunicação</h3>
            <p>
              Nossa equipe de Atendimento (Otto) está pronta para receber 
              sua mensagem e redirecioná-la diretamente para a caixa de 
              entrada criptografada do Vinícius.
            </p>
            <div className="contact-methods">
              <p>📍 Matriz: Base Devini9, Nuvem</p>
              <p>✉️ Email Seguro: viniciusfv.9@gmail.com</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Identificação do Usuário (Nome)</label>
              <input type="text" id="name" name="name" required placeholder="Ex: Visitante 1042" />
            </div>
            
            <div className="input-group">
              <label htmlFor="email">E-mail para Retorno</label>
              <input type="email" id="email" name="email" required placeholder="email@dominio.com" />
            </div>
            
            <div className="input-group">
              <label htmlFor="message">Dados da Transmissão (Mensagem)</label>
              <textarea id="message" name="message" rows={5} required placeholder="Insira sua mensagem aqui..."></textarea>
            </div>

            <button type="submit" className="submit-btn">
              [ ENTER ] Transmitir Dados
            </button>
            
            {status && <div className="form-status">{status}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}
