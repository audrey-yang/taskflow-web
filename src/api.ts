import PouchDB from "pouchdb-browser";
import PouchDBFind from "pouchdb-find";
PouchDB.plugin(PouchDBFind);
import { Priority, STATUS, Status, Task } from "./types";

let db: PouchDB.Database;

const updateTaskField = async (id: string, field: Partial<Task>) => {
  const task = await db.get(id);
  return await db.put({
    ...task,
    ...field,
  });
};

export const api = {
  initDb: (user: string) => {
    db = new PouchDB(`tasks_${user}`);
    const remoteDb = new PouchDB(
      `${import.meta.env.VITE_CLOUDANT_URL}_${user}`,
      {
        auth: {
          username: `${import.meta.env.VITE_CLOUDANT_USERNAME}`,
          password: `${import.meta.env.VITE_CLOUDANT_PASSWORD}`,
        },
      }
    );

    remoteDb
      .info()
      .then((_) => {
        console.log("Successfully connected to Cloudant");
      })
      .catch((err: any) => {
        console.error(err);
      });

    db.sync(remoteDb, {
      live: true,
      retry: true,
    });
  },
  createTask: async (task: Task) => {
    return await db.put({
      ...task,
      _id: Date.now().toString(),
    });
  },
  getChildTasksIncomplete: async (parentId: string) => {
    if (!db) {
      throw new Error("No database found");
    }

    return await db
      .find({
        selector: {
          parentId,
          status: { $gte: STATUS.IN_PROGRESS },
          priority: { $exists: true },
        },
        sort: [{ priority: "desc" }, { status: "desc" }],
      })
      .then((res: { docs: any }) => {
        return res.docs;
      });
  },
  getChildTasksComplete: async (parentId: string) => {
    if (!db) {
      return [];
    }

    return await db
      .find({
        selector: {
          parentId,
          status: STATUS.COMPLETED,
        },
      })
      .then((res: { docs: any }) => {
        return res.docs;
      });
  },
  countChildTasksByStatus: async (parentId: string, status: Status) => {
    return await db
      .find({
        selector: {
          parentId,
          status,
        },
        fields: ["_id"], // Only select the _id field to reduce data transfer
      })
      .then((res: { docs: string | any[] }) => {
        return res.docs.length;
      });
  },
  changeTaskPriority: async (id: string, priority: Priority) => {
    return await updateTaskField(id, { priority });
  },
  changeTaskStatus: async (id: string, status: Status) => {
    return await updateTaskField(id, { status });
  },
  changeTaskTitle: async (id: string, title: string) => {
    return await updateTaskField(id, { title });
  },
  changeTaskNote: async (id: string, note: string) => {
    return await updateTaskField(id, { note });
  },
  deleteTask: async (id: string) => {
    const recursiveDelete = async (parentId: string) => {
      // Find and delete descendants
      const result = await db.find({
        selector: {
          parentId,
        },
      });

      const children = result.docs;
      await Promise.all(
        children.map((child: { _id: string }) => {
          recursiveDelete(child._id);
        })
      );

      // Delete self
      await db.get(parentId).then((doc: any) => {
        db.remove(doc);
      });
    };

    // Recursively delete descendants
    await recursiveDelete(id);
  },
  checkPassword: (password: string) => {
    if (password === import.meta.env.VITE_APP_PASSWORD) {
      console.log(import.meta.env);
      return import.meta.env.VITE_CLOUDANT_DBNAME;
    }
    return "";
  },
};
