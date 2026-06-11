import Header from '@/components/header'

import ProjectForm from './project-form'

export default function CreateProject() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[600px]">
        <h1 className="text-2xl font-bold tracking-tight">Create project</h1>
        <ProjectForm />
      </main>
    </div>
  )
}
