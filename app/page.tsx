import { IrisDataTable } from "@/components/iris-data-table"
import { IrisDataProvider } from "@/components/iris-data-provider"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold bg-black text-white p-2 mb-6">
        Датасет півників
        <span className="text-gray-300 text-sm float-right mt-2">{new Date().toDateString()}</span>
      </h1>

      <div className="mb-6">
        <ul className="space-y-1 pl-4">
          <li>
            <strong>Екземпляри даних:</strong> 150
          </li>
          <li>
            <strong>Ознаки:</strong> 4
          </li>
          <li>
            <strong>Цільова змінна:</strong> Клас 'iris'
          </li>
        </ul>
      </div>

      <IrisDataProvider>
        <IrisDataTable />
      </IrisDataProvider>
    </main>
  )
}
