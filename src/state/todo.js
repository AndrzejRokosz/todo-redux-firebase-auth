import {database} from '../firebaseConfig'


const ADD_NEW_TASK = 'todo/ADD_NEW_TASK'
const GET_TASKS ='todo/GET_TASKS'


const INITIAL_STATE= {
    allTasks: null,
    visibleTasks:[],
    newTask:'',
    isCompleted:false

}


export const addNewTaskAction=text=>({
    type:ADD_NEW_TASK,
    text:text
})

const getTasksAction=tasks=>({
    type:GET_TASKS,
    tasks
})

export const addNewTaskToDbAsyncAction=()=>(dispatch,getState)=>{
    const newTask=getState().todo.newTask
    const uuid=getState().auth.user.uid
    const isCompleted=getState().todo.isCompleted

    newTask==='' ? 
    alert('No pain no gain. Add some task !!!')
    :
    database.ref(`users/${uuid}/tasks`).push({
        newTask,
        isCompleted
    })
}

export const getTasksFromDbAsyncAction=()=>(dispatch,getState)=>{
    const uuid=getState().auth.user.uid

    database.ref(`users/${uuid}/tasks`).on(
        'value',
        snapshot => {
            console.log(snapshot.val())
            if(snapshot.val()) {
            
                const tasks = Object.entries( snapshot.val() )
                            .map(entry => ({
                                ...entry[1],
                                key: entry[0]
                            }))
                dispatch(getTasksAction(tasks))
            } 
            else dispatch(getTasksAction(null))
        }
    )
}

export const deleteTaskAsyncAction= (key)=>(dispatch,getState)=>{
    const uuid=getState().auth.user.uid
    database.ref(`users/${uuid}/tasks`).child(key).remove()
}

export const toggleCompletedTasksAsyncAction=(task)=>(dispatch,getState)=>{
    const uuid=getState().auth.user.uid
    database.ref(`users/${uuid}/tasks/${task.key}`).update({
        isCompleted: !task.isCompleted
    })

}


export default (state=INITIAL_STATE,action)=>{
    switch (action.type) {
        case ADD_NEW_TASK: 
           return{
               ...state,
               newTask:action.text       
           }
        case GET_TASKS:
            return{
                ...state,
                allTasks: action.tasks
            }
       
        default:
           return state
    }
}