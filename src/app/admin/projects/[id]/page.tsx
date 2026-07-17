'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SlideOver } from '@/components/ui/SlideOver';
import { TaskForm } from '@/features/projects/components/TaskForm';
import { apiService } from '@/services/api.service';
import { ArrowLeft, Building2, Calendar, Users, FolderKanban, Plus, Clock, GripVertical } from 'lucide-react';
import { format } from 'date-fns';

const TASK_STAGES = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-800 border-slate-700' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-indigo-950/50 border-indigo-900/50' },
  { id: 'review', label: 'In Review', color: 'bg-amber-950/30 border-amber-900/50' },
  { id: 'done', label: 'Done', color: 'bg-emerald-950/30 border-emerald-900/50' },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projRes, tasksRes] = await Promise.all([
        apiService.get<any>(`/projects/${params.id}`),
        apiService.get<any[]>(`/tasks?projectId=${params.id}&limit=1000`)
      ]);
      
      if (projRes.success && projRes.data) {
        setProject(projRes.data);
      }
      if (tasksRes.success && tasksRes.data) {
        setTasks(tasksRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch project data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setIsDragging(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const taskToMove = tasks.find(t => t._id === taskId);
    if (!taskToMove || taskToMove.status === targetStage) return;

    // Optimistic update
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: targetStage } : t));

    try {
      await apiService.patch(`/tasks/${taskId}`, { status: targetStage });
    } catch (error) {
      console.error('Failed to update task status:', error);
      fetchData(); // revert
    }
  };

  if (isLoading) {
    return (
      <ContentArea>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      </ContentArea>
    );
  }

  if (!project) {
    return (
      <ContentArea>
        <div className="text-center mt-12 text-slate-400">Project not found.</div>
      </ContentArea>
    );
  }

  return (
    <ContentArea>
      <div className="mb-6">
        <button 
          onClick={() => router.push('/projects')}
          className="flex items-center text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FolderKanban className="h-6 w-6 text-indigo-500" />
            {project.name}
          </h1>
          <p className="mt-2 text-slate-400 max-w-3xl">{project.description || 'No description provided.'}</p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <Badge variant={project.status === 'active' ? 'success' : project.status === 'planning' ? 'info' : 'default'} className="capitalize">
                {project.status.replace('-', ' ')}
              </Badge>
            </div>
            
            {project.customerId && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-slate-500" />
                <span className="text-slate-300">{project.customerId.name}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>
                {project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : 'TBD'} - {project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : 'TBD'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-slate-500" />
              <span>{project.members.length} members</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">Edit Project</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsTaskFormOpen(true)}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['tasks', 'overview', 'time logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium capitalize transition-colors
                ${activeTab === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Task Board */}
      {activeTab === 'tasks' && (
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {TASK_STAGES.map(stage => {
            const stageTasks = tasks.filter(t => t.status === stage.id).sort((a, b) => a.order - b.order);
            
            return (
              <div 
                key={stage.id} 
                className={`flex w-80 shrink-0 flex-col rounded-xl border ${stage.color} overflow-hidden`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="flex items-center justify-between border-b border-inherit bg-black/20 p-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-200">{stage.label}</h3>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800/50 text-xs text-slate-400">
                      {stageTasks.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px]">
                  {stageTasks.map((task) => (
                    <div 
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      onDragEnd={() => setIsDragging(false)}
                      className="group cursor-grab rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all active:cursor-grabbing"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <Badge variant="default" className="text-[10px] uppercase tracking-wider">{task.priority}</Badge>
                        <GripVertical className="h-4 w-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <h4 className="font-medium text-slate-200 text-sm mb-3 leading-snug">{task.title}</h4>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {task.estimatedHours ? `${task.estimatedHours}h` : '--'}
                        </div>
                        
                        {task.assigneeId ? (
                          <div 
                            className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-300 font-medium"
                            title={`${task.assigneeId.firstName} ${task.assigneeId.lastName}`}
                          >
                            {task.assigneeId.firstName.charAt(0)}{task.assigneeId.lastName.charAt(0)}
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                            <span className="sr-only">Unassigned</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {stageTasks.length === 0 && (
                    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-700/50 bg-slate-800/30">
                      <span className="text-sm text-slate-500">Drop tasks here</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-slate-200 mb-4">Project Overview</h3>
            <p className="text-slate-400">Detailed overview and metrics will go here.</p>
          </div>
          
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Team Members</h3>
            <div className="space-y-4">
              {project.members.map((member: any) => (
                <div key={member._id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 font-medium">
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{member.firstName} {member.lastName}</div>
                    <div className="text-xs text-slate-500">{member.email}</div>
                  </div>
                  {project.managerId?._id === member._id && (
                    <Badge variant="info" className="ml-auto text-[10px]">Manager</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'time logs' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-500 py-12">
          <Clock className="h-8 w-8 mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">Time Tracking</h3>
          <p>Time logging functionality will be implemented in the next iteration.</p>
        </div>
      )}

      <SlideOver
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        title="Create New Task"
        description={`Add a new task to ${project.name}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsTaskFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('task-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Create Task
            </Button>
          </>
        }
      >
        <TaskForm 
          projectId={project._id}
          onSuccess={() => {
            setIsTaskFormOpen(false);
            fetchData();
          }} 
          onCancel={() => setIsTaskFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
