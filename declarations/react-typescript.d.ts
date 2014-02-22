


declare module 'react-typescript' {
  class ReactComponentBase<P, S> {

    constructor(props: P, childen?: any[]);

    props: P;
    state: S;
    refs: { [ref: string]: React.ReactComponent<any, any>; }

    getDOMNode(): Element;
    setProps(nextProps: P): void;
    replaceProps(nextProps: P): void
    transferPropsTo<C extends React.ReactComponent<any, any>> (target: C): C
      

    /**
     * Sets a subset of the state. Always use this or `replaceState` to mutate
     * state. You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * There is no guarantee that calls to `setState` will run synchronously,
     * as they may eventually be batched together.  You can provide an optional
     * callback that will be executed when the call to setState is actually
     * completed.
     *
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after state is updated.
     * @final
     * @protected
     */
    setState(nextProps: S, callback?: () => void): void
    replaceState(nextProps: S): void;
    forceUpdate(callback? : () => void): void;
      
    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted(): boolean;
      
      
    updateComponent(): void;

    //private method injected by React that should not be overriden
    private construct(): void;
    private mountComponent(): void;
    private unmountComponent(): void;
    private _processContext(): void;
    private _processChildContext(): void;
    private _processProps(): void;
    private _checkPropTypes(): void;
    private performUpdateIfNecessary(): void;
    private _performUpdateIfNecessary(): void;
    private _performComponentUpdate(): void;
    private receiveComponent(): void;
    private _renderValidatedComponent(): void;
    private _bindAutoBindMethods(): void;
    private _bindAutoBindMethod(): void;

    static applyMixins(...mixins: React.ReactMixin<any, any>[]): void;
  }
  
  /**
   * autoBinds method of a class
   */
  function autoBindMethods(func: Function): void;
}