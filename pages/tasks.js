// pages/tasks.js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [taskName, setTaskName] = useState('')

  // タスクを取得する関数
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.log(error)
    } else {
      setTasks(data)
    }
  }

  // タスクを追加する関数
  const addTask = async (e) => {
    e.preventDefault()

    if (!taskName) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ task_name: taskName, is_completed: false }])

    if (error) {
      console.log(error)
    } else {
      setTaskName('') // 入力をクリア
      fetchTasks()    // 新しいタスクを表示
    }
  }

  // ページが初めてロードされたときにタスクを取得
  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div>
      <h1>タスク一覧</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="新しいタスク"
        />
        <button type="submit">追加</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.task_name}</span> - {task.is_completed ? '完了' : '未完了'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TasksPage