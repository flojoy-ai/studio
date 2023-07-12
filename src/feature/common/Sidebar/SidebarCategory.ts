
export type CategoryElement = string;

export interface SidebarCategory {
    Data: CategoryElement[];
    ETL: CategoryElement[];
    IO: CategoryElement[];
    Flow: CategoryElement[];
    Numpy: CategoryElement[];
    Scipy: CategoryElement[];
}

export const SidebarData : SidebarCategory = {
    Data : ["AI_ML", "GENERATOR", "VISUALIZER"],
    ETL : ["AI_ML", "GENERATOR", "VISUALIZER"],
    IO: ["INSTRUMENTS"],
    Flow: ["LOGIC_GATES"],
    Numpy: ["NUMPY"],
    Scipy: ["SCIPY"],
}



