import { useState, useEffect } from 'react';
import { to_do_backend } from 'declarations/to_do_backend';

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [totalEmAndamento, setTotalEmAndamento] = useState(0);
  const [totalConcluidas, setTotalConcluidas] = useState(0);
  
  useEffect(() => {
    consultarTarefas();
    totalTarefasEmAndamento();
    totalTarefasConcluidas();
  }, []);
  
  async function consultarTarefas() {
    setTarefas(await to_do_backend.getTarefas());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const idTarefa = event.target.elements.idTarefa.value;
    const categoria = event.target.elements.categoria.value;
    const descricao = event.target.elements.descricao.value;
    const urgente = event.target.elements.urgente.value === "false" ? false : true;

    if (!idTarefa) {
      await to_do_backend.addTarefa(descricao, categoria, false, false);
    } else {
      await to_do_backend.alterarTarefa(parseInt(idTarefa), categoria, descricao, urgente, false);
    }

    await consultarTarefas();
    await totalTarefasEmAndamento();
    await totalTarefasConcluidas();

    event.target.elements.idTarefa.value = "";
    event.target.elements.categoria.value = "";
    event.target.elements.descricao.value = "";
    event.target.elements.urgente.value = "";
  }

  async function excluir(id) {
    await to_do_backend.excluirTarefa(parseInt(id));
    await consultarTarefas();
    await totalTarefasEmAndamento();
    await totalTarefasConcluidas();
  }

  async function alterar(id, categoria, descricao, urgente, concluida) {
    await to_do_backend.alterarTarefa(parseInt(id), categoria, descricao, urgente, concluida);
    await consultarTarefas();
    await totalTarefasEmAndamento();
    await totalTarefasConcluidas();
  }

  async function editar(id, categoria, descricao, urgente) {
    document.getElementById('formTarefas').elements['idTarefa'].value = id;
    document.getElementById('formTarefas').elements['categoria'].value = categoria;
    document.getElementById('formTarefas').elements['descricao'].value = descricao;
    document.getElementById('formTarefas').elements['urgente'].value = urgente;
  }

  async function totalTarefasEmAndamento() {
    const total = parseInt(await to_do_backend.totalTarefasEmAndamento());
    setTotalEmAndamento(total);
  }

  async function totalTarefasConcluidas() {
    const total = parseInt(await to_do_backend.totalTarefasConcluidas());
    setTotalConcluidas(total);
  }

  return (
    <main className="mt-[30px] mx-[30px]">
      <form id="formTarefas" className="flex space-x-4" onSubmit={handleSubmit}>
        <div className="w-[15%]">
          <select id="categoria" className="block w-full px-4 py-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option defaultValue="">Categoria</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Saúde">Saúde</option>
            <option value="Casa">Casa</option>
            <option value="Lazer">Lazer</option>
            <option value="Estudo">Estudo</option>
            <option value="Pessoal">Pessoal</option>
            <option value="Compras">Compras</option>
            <option value="Projetos">Projetos</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div className="w-[85%] relative">
          <input type="text" id="descricao" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Adicione uma tarefa" required />
          <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Adicionar</button>
        </div>

        <input type="hidden" name="idTarefa" />
        <input type="hidden" name="urgente" />
      </form>

      <br />

      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Tarefas em andamento</h5>
        </div>

        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {tarefas.filter((ta) => !ta.concluida).map((ta) => (
              <li key={ta.id} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <a onClick={() => alterar(ta.id, ta.categoria, ta.descricao, !ta.urgente, ta.concluida)} className="cursor-pointer">
                      {!ta.urgente && (
                        <svg className="w-6 h-6 ms-2 text-gray-300 dark:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44 1.287 3.947c.3.921-.755 1.688-1.54 1.117L10 13.347l-3.36 2.44c-.784.57-1.838-.196-1.54-1.117l1.287-3.947-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.15l1.286-3.947z" />
                        </svg>
                      )}
                    </a>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ta.descricao}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{ta.categoria}</p>
                  </div>
                  <div className="ml-auto flex space-x-2">
                    <button onClick={() => editar(ta.id, ta.categoria, ta.descricao, ta.urgente)} className="text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => excluir(ta.id)} className="text-red-600 hover:underline">Excluir</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default Tarefas;
