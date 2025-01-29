// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import Home from './pages/Home';
import StatsPage from './pages/stats/StatsPage';
import UsersPage from './pages/UsersPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';

import TeamsPage from './pages/teams/TeamsPage';
import TeamCreatePage from './pages/teams/TeamCreatePage';
import TeamEditPage from './pages/teams/TeamEditPage';

import TrainingsPage from './pages/trainings/TrainingsPage';
import TrainingCreatePage from './pages/trainings/TrainingCreatePage';
import TrainingEditPage from './pages/trainings/TrainingEditPage';

import ExercisesPage from './pages/exercises/ExercisesPage';
import ExerciseCreatePage from './pages/exercises/ExerciseCreatePage';
import ExerciseEditPage from './pages/exercises/ExerciseEditPage';

import ManageTrainingExercisePage from './pages/trainingExercises/ManageTrainingExercisePage';

import PavilionsPage from './pages/pavilions/PavilionsPage';
import PavilionCreatePage from './pages/pavilions/PavilionCreatePage';
import PavilionEditPage from './pages/pavilions/PavilionEditPage';
import TeamMembersPage from './pages/teams/TeamMembersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <Home />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <StatsPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <UsersPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <ProfilePage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />

        {/* TEAMS */}
        <Route
          path="/teams"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <TeamsPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/create"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <TeamCreatePage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:id/edit"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <TeamEditPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/teams/:id/members"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <TeamMembersPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />

        {/* TRAININGS */}
        <Route
          path="/trainings"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <TrainingsPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/trainings/create"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <TrainingCreatePage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/trainings/:id/edit"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <TrainingEditPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />

        {/* PAVILIONS */}
        <Route
          path="/pavilions"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <PavilionsPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pavilions/create"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <PavilionCreatePage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pavilions/:id/edit"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <PavilionEditPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />

        {/* EXERCISE */}
        <Route
          path="/exercises"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <ExercisesPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/exercises/create"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <ExerciseCreatePage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/exercises/:id/edit"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <ExerciseEditPage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />

        {/* TRAININGEXERCISE */}
        <Route
          path="/trainings/:trainingId/exercises"
          element={
            <PrivateRoute>
              <SidebarLayout>
                <ManageTrainingExercisePage />
              </SidebarLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
