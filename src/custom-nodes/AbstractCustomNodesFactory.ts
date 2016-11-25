import { TObfuscationEvent } from '../types/TObfuscationEvent';

import { ICustomNode } from '../interfaces/custom-nodes/ICustomNode';
import { ICustomNodesFactory } from '../interfaces/ICustomNodesFactory';
import { IObfuscationEventEmitter } from '../interfaces/IObfuscationEventEmitter';
import { IOptions } from '../interfaces/IOptions';
import { IStackTraceData } from '../interfaces/stack-trace-analyzer/IStackTraceData';

import { ObfuscationEvents } from '../enums/ObfuscationEvents';

export abstract class AbstractCustomNodesFactory implements ICustomNodesFactory {
    /**
     * @type {TObfuscationEvent}
     */
    protected readonly appendEvent: TObfuscationEvent = ObfuscationEvents.BeforeObfuscation;

    /**
     * @type {IStackTraceData[]}
     */
    protected readonly stackTraceData: IStackTraceData[];

    /**
     * @type {IOptions}
     */
    protected readonly options: IOptions;

    /**
     * @param options
     */
    constructor (options: IOptions) {
        this.options = options;
    }

    /**
     * @param obfuscationEventEmitter
     * @param stackTraceData
     * @returns {Map<string, ICustomNode> | undefined}
     */
    public abstract initializeCustomNodes (
        obfuscationEventEmitter: IObfuscationEventEmitter,
        stackTraceData: IStackTraceData[]
    ): Map <string, ICustomNode> | undefined;

    /**
     * @param obfuscationEventEmitter
     * @param customNodes
     * @returns {Map<string, ICustomNode>}
     */
    protected syncCustomNodesWithNodesFactory (
        obfuscationEventEmitter: IObfuscationEventEmitter,
        customNodes: Map <string, ICustomNode>
    ): Map <string, ICustomNode> {
        customNodes.forEach((node: ICustomNode) => {
            node.setAppendEvent(this.appendEvent);

            obfuscationEventEmitter.on(node.getAppendEvent(), node.appendNode.bind(node));
        });

        return customNodes;
    }
}