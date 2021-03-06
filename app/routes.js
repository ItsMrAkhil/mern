// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

import appReducer from './containers/App/reducer';
import appSagas from './containers/App/sagas';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  injectReducer('app', appReducer);
  injectSagas(appSagas);
  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/register',
      name: 'register',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Register/reducer'),
          import('containers/Register/sagas'),
          import('containers/Register'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('register', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/tasks',
      name: 'tasksPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/TasksPage/reducer'),
          import('containers/TasksPage/sagas'),
          import('containers/TasksPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('tasksPage', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: 'list',
          name: 'listTasks',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/TasksPage/ListTasksPage/reducer'),
              System.import('containers/TasksPage/ListTasksPage/sagas'),
              System.import('containers/TasksPage/ListTasksPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('listTasksPage', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });
            importModules.catch(errorLoading);
          },
        }, {
          path: 'deleted',
          name: 'deletedTasks',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/TasksPage/DeletedTasksPage/reducer'),
              System.import('containers/TasksPage/DeletedTasksPage/sagas'),
              System.import('containers/TasksPage/DeletedTasksPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer('deletedTasksPage', reducer.default);
              injectSagas(sagas.default);
              renderRoute(component);
            });
            importModules.catch(errorLoading);
          },
        },
      ],
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
