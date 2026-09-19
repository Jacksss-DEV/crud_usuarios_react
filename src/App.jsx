import { useEffect, useState } from 'react';
import './App.css';

const initialUsers = [
  {
    id: 1,
    nome: 'Jackson Silva',
    email: 'jackson.silva@email.com',
    cargo: 'Desenvolvedor Front-end',
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Maria Clara',
    email: 'maria.clara@email.com',
    cargo: 'Analista de Folha de Pagamento',
    status: 'Inativo',
  },
];

const emptyForm = {
  nome: '',
  email: '',
  cargo: '',
  status: 'Ativo',
};

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const openCreateModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      status: user.status,
    });
    setEditingId(user.id);
    setIsFormOpen(true);
    showToast('Modo de edição ativado.');
  };

  const showToast = (message) => {
    setToast(message);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nome = formData.nome.trim();
    const email = formData.email.trim();
    const cargo = formData.cargo.trim();

    if (!nome || !email || !cargo) {
      showToast('Preencha nome, e-mail e cargo.');
      return;
    }

    if (editingId) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingId ? { ...user, ...formData, nome, email, cargo } : user,
        ),
      );
      showToast('Usuário atualizado com sucesso!');
    } else {
      const newUser = {
        // eslint-disable-next-line react-hooks/purity
        id: Date.now(),
        ...formData,
        nome,
        email,
        cargo,
      };

      setUsers((prevUsers) => [newUser, ...prevUsers]);
      showToast('Usuário cadastrado com sucesso!');
    }

    resetForm();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteTarget));

    if (editingId === deleteTarget) {
      resetForm();
    }

    setDeleteTarget(null);
    showToast('Usuário removido com sucesso.');
  };

  const userCountLabel = users.length === 1 ? 'usuário' : 'usuários';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Sistema</p>
          <h1>Cadastro de usuários</h1>
        </div>
        <span className="badge">
          <span>{users.length}</span>
          <span>{userCountLabel}</span>
        </span>
      </header>

      <main className="app-content">
        <section className="panel list-panel">
          <div className="list-header">
            <h2>Usuários cadastrados</h2>
            <button type="button" className="primary-button small" onClick={openCreateModal}>
              + Novo usuário
            </button>
          </div>

          {users.length === 0 ? (
            <p className="empty-state">Nenhum usuário cadastrado.</p>
          ) : (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id} className="user-card">
                  <div className="user-main">
                    <strong>{user.nome}</strong>
                    <span>{user.email}</span>
                  </div>

                  <div className="user-meta">
                    <span>{user.cargo}</span>
                    <span className={`status ${user.status.toLowerCase()}`}>{user.status}</span>
                  </div>

                  <div className="user-actions">
                    <button type="button" className="edit-button" onClick={() => openEditModal(user)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => setDeleteTarget(user.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {isFormOpen && (
        <div className="modal-backdrop" onClick={resetForm}>
          <div className="user-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-title-row">
              <h3>{editingId ? 'Modo de edição' : 'Adicionar usuário'}</h3>
              <button type="button" className="close-button" onClick={resetForm} aria-label="Fechar">
                ×
              </button>
            </div>

            <form className="user-form modal-form" onSubmit={handleSubmit}>
              <label>
                Nome
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome"
                />
              </label>

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemplo@email.com"
                />
              </label>

              <label>
                Cargo
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  placeholder="Digite o cargo"
                />
              </label>

              <label>
                Status
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </label>

              <div className="actions modal-actions">
                <button type="button" className="secondary-button" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? 'Salvar alterações' : 'Cadastrar usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Excluir usuário</h3>
            <p>Tem certeza que deseja remover este usuário?</p>
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
              <button type="button" className="delete-button danger" onClick={confirmDelete}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
