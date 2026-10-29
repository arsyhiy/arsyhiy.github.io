import { useState } from 'react'
import './panel.css'
import ReactMarkdown from 'react-markdown'

function Panel() {
  const [windowName, setWindowName] = useState(null)
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [projectsError, setProjectsError] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [readme, setReadme] = useState('')
  const [loadingReadme, setLoadingReadme] = useState(false)
  const [skills, setSkills] = useState('')
  const [loadingSkills, setLoadingSkills] = useState(false)
  const [skillsError, setSkillsError] = useState('')

  async function loadSkills() {
    setLoadingSkills(true)
    setSkillsError('')

    try {
      const response = await fetch('/skills.md')

      if (!response.ok) {
        throw new Error('Не удалось загрузить skills.md')
      }

      setSkills(await response.text())
    } catch (error) {
      console.error(error)
      setSkillsError('Не удалось загрузить skills.md.')
    } finally {
      setLoadingSkills(false)
    }
  }

  async function loadProjects() {
    setLoadingProjects(true)
    setProjectsError('')

    try {
      const response = await fetch(
        'https://api.github.com/users/arsyhiy/repos?per_page=100&sort=updated'
      )

      if (!response.ok) {
        throw new Error('Не удалось загрузить репозитории')
      }

      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error(error)
      setProjectsError('Не удалось загрузить проекты с GitHub.')
    } finally {
      setLoadingProjects(false)
    }
  }

  async function openProject(project) {
    setSelectedProject(project)
    setReadme('')
    setLoadingReadme(true)

    try {
      const response = await fetch(
        `https://api.github.com/repos/arsyhiy/${encodeURIComponent(project.name)}/readme`,
        {
          headers: {
            Accept: 'application/vnd.github.raw+json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('README не найден')
      }

      setReadme(await response.text())
    } catch (error) {
      console.error(error)
      setReadme('README отсутствует или не удалось его загрузить.')
    } finally {
      setLoadingReadme(false)
    }
  }

  function openWindow(name) {
    setWindowName(name)
    setSelectedProject(null)

    if (name === 'projects') {
      loadProjects()
    }

    if (name === 'skills') {
      loadSkills()
    }
  }

  function closeWindow() {
    setWindowName(null)
    setSelectedProject(null)
  }

  return (
    <>
      <div className="panel">
        <button onClick={() => openWindow('projects')}>
          projects
        </button>

        <button onClick={() => openWindow('skills')}>
          skills
        </button>
      </div>

      {windowName && (
        <div className="overlay" onClick={closeWindow}>
          <div
            className="popup"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="close" onClick={closeWindow}>
              ×
            </button>

            {windowName === 'projects' && (
              <div className="projects-content">
                {selectedProject ? (
                  <>
                    <button
                      className="back"
                      onClick={() => setSelectedProject(null)}
                    >
                      ← back
                    </button>

                    <h2>{selectedProject.name}</h2>

                    <p>
                      {selectedProject.description ||
                        'Описание отсутствует.'}
                    </p>

                    <a
                      href={selectedProject.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open on GitHub
                    </a>

                    <hr />

                    <h3>README</h3>

                    {loadingReadme ? (
                      <p>Загрузка README...</p>
                    ) : (
                      <pre className="readme">{readme}</pre>
                    )}
                  </>
                ) : (
                  <>
                    <h2>Projects</h2>

                    {loadingProjects && <p>Загрузка проектов...</p>}

                    {projectsError && <p>{projectsError}</p>}

                    {!loadingProjects &&
                      !projectsError &&
                      projects.map((project) => (
                        <p key={project.id}>
                          <button
                            className="project-link"
                            onClick={() => openProject(project)}
                          >
                            {project.name}
                          </button>
                        </p>
                      ))}
                  </>
                )}
              </div>
            )}

            {windowName === 'skills' && (
              <div className="skills-content">
                {loadingSkills ? (
                  <p>Загрузка навыков...</p>
                ) : skillsError ? (
                  <p>{skillsError}</p>
                ) : (
                  <ReactMarkdown>{skills}</ReactMarkdown>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Panel
