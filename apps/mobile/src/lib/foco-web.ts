import { Platform } from 'react-native';

/**
 * Foco visible con teclado en web: contorno de 3 px en la tinta del tema, separado del control. El anillo por
 * defecto del navegador es de 1 px y casi no se ve sobre el papel. Solo con teclado (:focus-visible), no al tocar.
 */
if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('luca-foco')) {
  const estilo = document.createElement('style');
  estilo.id = 'luca-foco';
  estilo.textContent = `
    :root { --luca-foco: #2A2219; }
    @media (prefers-color-scheme: dark) { :root { --luca-foco: #F6EEDC; } }
    :focus-visible { outline: 3px solid var(--luca-foco) !important; outline-offset: 3px !important; border-radius: 10px; }
    input:focus-visible, textarea:focus-visible { outline-offset: 1px !important; }
  `;
  document.head.appendChild(estilo);
}
