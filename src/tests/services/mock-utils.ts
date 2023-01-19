/**
 * spyOn references to classes. Use it with spyOnClass
 */
export const classSpy: any = {};

/**
 * Utility to Spy On all class methods. Not including the constructor
 * @returns a spyOn references to all the class methods
 * includes the methods mockClear and mockReset as convenience
 * to trigger the respective method for all the spies
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function spyOnClassMethods(proto: any): any {
    const properties = Object.getOwnPropertyNames(proto);
    const spyHolder: any = {};
    for (const i in properties) { spyHolder[properties[i]] = jest.spyOn(proto, properties[i]); }
    spyHolder.mockClear = (): void => { for (const i in properties) { spyHolder[properties[i]].mockClear(); } };
    spyHolder.mockReset = (): void => { for (const i in properties) { spyHolder[properties[i]].mockReset(); } };
    return spyHolder;
}
// To attend jest.mock problems, the should start with 'mock'
const mocksSpyOnClassMethods = spyOnClassMethods;

/**
 * Utility to Spy On all class methods and its constructor.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

interface CustomErrorProps {
    statusCode: number;
    statusText: string;
  }

export function spyOnClass(mockModuleName: string, mockClassName: string): any {
    classSpy[mockClassName] = {};
    jest.mock(mockModuleName, () => {
        const module = jest.requireActual(mockModuleName) as any;
        const mock = {};
        classSpy[mockClassName] = spyOnClassMethods(module[mockClassName].prototype);
        mock[mockClassName] = jest.fn().mockImplementation(
            (data:CustomErrorProps,...args: any) => {
                const instance = new module[mockClassName](data);
                classSpy[mockClassName].constructor = mock[mockClassName];
                return instance;
            }
        );
        return { ...module, ...mock };
    });
}