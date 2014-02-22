declare module React {
    
	/**
	 * Configure React's event system to handle touch events on mobile devices.
	 * @param shouldUseTouch true if React should active touch events, false if it should not  
	 */
	function initializeTouchEvents(shouldUseTouch: boolean): void;
	
    /**
	 * Create a component given a specification. A component implements a render method which returns one single child. 
	 * That child may have an arbitrarily deep child structure. 
	 * One thing that makes components different than standard prototypal classes is that you don't need to call new on them. 
	 * They are convenience wrappers that construct backing instances (via new) for you.
	 * 
	 * @param spec the component spécification
	 */
    // we need mixins and type union here, until that manually specifies the type.
	function createClass<P, S>(spec: ReactComponentSpec<P, S>): ReactComponentFactory<P, ReactComponent<P, S>>;
	
    /**
     * Render a React component into the DOM in the supplied container.
     * If the React component was previously rendered into container, 
     * this will perform an update on it and only mutate the DOM as necessary to reflect the latest React component.
     * 
     * @param component the component to render
     * @param container the node that should contain the result of rendering
     * @param callback an optional callback that will be executed after the component is rendered or updated. 
     */
	function renderComponent<C extends ReactComponent<any, any>>(component: C, container: Element, callback?: () => void): C;
    
    /**
     * Remove a mounted React component from the DOM and clean up its event handlers and state. 
     * If no component was mounted in the container, calling this function does nothing. 
     * Returns true if a component was unmounted and false if there was no component to unmount.
     * 
     * @param container the node that should be cleaned from React component
     */
	function unmountComponentAtNode(container: Element): boolean;
		
    /**
     * Render a component to its initial HTML. This should only be used on the server. 
     * React will call callback with an HTML string when the markup is ready. 
     * You can use this method to can generate HTML on the server and send the markup down on the initial request for faster page loads 
     * and to allow search engines to crawl your pages for SEO purposes. 
     * If you call React.renderComponent() on a node that already has this server-rendered markup, 
     * React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
     * 
     * @param component the component to render
     * @param callback a callback that will be executed with the result string
     */
	function renderComponentToString(component: ReactComponent<any, any>, callback: (result: string) => void): void;

    /**
     * Component classses created by createClass() return instances of ReactComponent when called. 
     * Most of the time when you're using React you're either creating or consuming these component objects.
     */
    interface ReactComponent<P, S> {
        
        refs: { [ref: string]: ReactComponent<any, any>; }
        /**
         * If this component has been mounted into the DOM, this returns the corresponding native browser DOM element. 
         * This method is useful for reading values out of the DOM, such as form field values and performing DOM measurements.
         */
        getDOMNode(): Element;
        
        /**
         * When you're integrating with an external JavaScript application you may want to signal a change to a React component rendered with renderComponent(). 
         * Simply call setProps() to change its properties and trigger a re-render.
         * 
         * @param nextProps the object that will be merged with the component's props
         * @param callback an optional callback function that is executed once setProps is completed.
         */
        setProps(nextProps: P, callback?: () => void): void;
        
        /**
         * Like setProps() but deletes any pre-existing props instead of merging the two objects.
         * 
         * @param nextProps the object that will replace the component's props
         * @param callback an optional callback function that is executed once replaceProps is completed.
         */
        replaceProps(nextProps: P, callback?: () => void): void;
        
        /**
         * Transfer properties from this component to a target component that have not already been set on the target component. 
         * After the props are updated, targetComponent is returned as a convenience. 
         * 
         * @param target the component that will receive the props
         */
        transferPropsTo<C extends ReactComponent<any, any>>(target: C): C;
        
        /**
         * Merges nextState with the current state. 
         * This is the primary method you use to trigger UI updates from event handlers and server request callbacks. 
         * In addition, you can supply an optional callback function that is executed once setState is completed.
         * 
         * @param nextState the object that will be merged with the component's state
         * @param callback an optional callback function that is executed once setState is completed.
         */
        setState(nextState: S, callback?: () => void): void;
        
        /**
         * Like setState() but deletes any pre-existing state keys that are not in nextState.
         * 
         * @param nextState the object that will replace the component's state
         * @param callback an optional callback function that is executed once replaceState is completed.
         */
        replaceState(nextState: S, callback?: () => void): void;
        
        /**
         * If your render() method reads from something other than this.props or this.state, 
         * you'll need to tell React when it needs to re-run render() by calling forceUpdate(). 
         * You'll also need to call forceUpdate() if you mutate this.state directly.
         * Calling forceUpdate() will cause render() to be called on the component and its children, 
         * but React will still only update the DOM if the markup changes.
         * Normally you should try to avoid all uses of forceUpdate() and only read from this.props and this.state in render(). 
         * This makes your application much simpler and more efficient.
         * 
         * @param callback an optional callback that is executed once forceUpdate is completed.
         */
        forceUpdate(callback? : () => void): void;
    }
    
    
    interface ReactComponentFactory<P, C extends ReactComponent<any, any>> {
        (protperties?: P, ...children: any[]): C
    }
    /**
     * interface describing ReactComponentSpec
     */
    interface ReactMixin<P,S> {
        
        /**
         * Invoked immediately before rendering occurs. 
         * If you call setState within this method, render() will see the updated state and will be executed only once despite the state change.
         */
        componentWillMount?(): void;
        
        /**
         * Invoked immediately after rendering occurs. 
         * At this point in the lifecycle, the component has a DOM representation which you can access via the rootNode argument or by calling this.getDOMNode().
         * If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval, 
         * or send AJAX requests, perform those operations in this method.
         */
        componentDidMount?(): void;
        
        /**
         * Invoked when a component is receiving new props. This method is not called for the initial render.
         * 
         * Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState(). 
         * The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
         * 
         * @param nextProps the props object that the component will receive
         */
        componentWillReceiveProps?(nextProps: P): void;
        
        /**
         * Invoked before rendering when new props or state are being received. 
         * This method is not called for the initial render or when forceUpdate is used.
         * Use this as an opportunity to return false when you're certain that the transition to the new props and state will not require a component update.
         * By default, shouldComponentUpdate always returns true to prevent subtle bugs when state is mutated in place, 
         * but if you are careful to always treat state as immutable and to read only from props and state in render() 
         * then you can override shouldComponentUpdate with an implementation that compares the old props and state to their replacements.
         * 
         * If performance is a bottleneck, especially with dozens or hundreds of components, use shouldComponentUpdate to speed up your app.
         * 
         * @param nextProps the props object that the component will receive
         * @param nextState the state object that the component will receive
         */
        shouldComponentUpdate?(nextProps: P, nextState: S): boolean;	
        
        /**
         * Invoked immediately before rendering when new props or state are being received. This method is not called for the initial render.
         * Use this as an opportunity to perform preparation before an update occurs.
         * 
         * @param nextProps the props object that the component has received
         * @param nextState the state object that the component has received
         */
        componentWillUpdate?(nextProps: P, nextState: S): void;	
        
        /**
         * Invoked immediately after updating occurs. This method is not called for the initial render.
         * Use this as an opportunity to operate on the DOM when the component has been updated.
         * 
         * @param nextProps the props object that the component has received
         * @param nextState the state object that the component has received
         */
        componentDidUpdate?(nextProps: P, nextState: S): void;
        
        /**
         * Invoked immediately before a component is unmounted from the DOM.
         * Perform any necessary cleanup in this method, such as invalidating timers or cleaning up any DOM elements that were created in componentDidMount.
         */
        componentWillUnmount?(): void;	
    }
    
    
    interface ReactComponentSpec<P,S> extends ReactMixin<P, S> {
        
         /**
         * The mixins array allows you to use mixins to share behavior among multiple components. 
         */
        mixins?: ReactMixin<any, any>[];
        
        /**
         * The displayName string is used in debugging messages. JSX sets this value automatically.
         */
        displayName?: string;
        
        /**
         * The propTypes object allows you to validate props being passed to your components.
         */
        propTypes?: {};
        
        /**
         * Invoked once before the component is mounted. The return value will be used as the initial value of this.state.
         */
        getInitialState?(): S;
        
        
        /**
         * The render() method is required. When called, it should examine this.props and this.state and return a single child component. 
         * This child component can be either a virtual representation of a native DOM component (such as <div /> or React.DOM.div()) 
         * or another composite component that you've defined yourself.
         * The render() function should be pure, meaning that it does not modify component state, it returns the same result each time it's invoked, 
         * and it does not read from or write to the DOM or otherwise interact with the browser (e.g., by using setTimeout). 
         * If you need to interact with the browser, perform your work in componentDidMount() or the other lifecycle methods instead. 
         * Keeping render() pure makes server rendering more practical and makes components easier to think about.
         */
        render(): ReactComponent<any, any>;
        
        
        /**
         * Invoked once when the component is mounted. 
         * Values in the mapping will be set on this.props if that prop is not specified by the parent component (i.e. using an in check).
         * This method is invoked before getInitialState and therefore cannot rely on this.state or use this.setState.
         */
        getDefaultProps?(): P;
    
    }
    
    export interface SyntheticEvent {
        bubbles: boolean;
        cancelable: boolean;
        currentTarget: EventTarget;
        defaultPrevented: boolean;
        eventPhase: number;
        isTrusted: boolean
        nativeEvent: Event;
        target:EventTarget
        type: string;
        timeStamp: Date; 
        
        preventDefault(): void;
        stopPropagation(): void;
    }
    
    export interface ClipboardEvent extends SyntheticEvent {
        clipboardData: DataTransfer;
    }
    
    export interface KeyboardEvent extends SyntheticEvent {
        altKey: boolean;
        ctrlKey: boolean;
        charCode: number;
        key: string;
        keyCode: number;
        locale: string;
        location: number;
        metaKey: boolean;
        repeat: boolean;
        shiftKey: boolean;
        which: number;
    }
    
    export interface FocusEvent extends SyntheticEvent {
        relatedTarget: EventTarget;
    }
    
    export interface FormEvent extends SyntheticEvent {
    }
    
    export interface MouseEvent extends SyntheticEvent {
        altKey: boolean;
        button: number;
        buttons: number;
        clientX: number;
        clientY: number;
        ctrlKey: boolean;
        metaKey: boolean
        pageX: number;
        pageY: number;
        relatedTarget: EventTarget;
        screenX: number;
        screenY: number;
        shiftKey: boolean;
    }
    
    
    export interface TouchEvent extends SyntheticEvent {
        altKey: boolean;
        changedTouches: TouchEvent;
        ctrlKey: boolean;
        metaKey: boolean;
        shiftKey: boolean;
        targetTouches: any//DOMTouchList;
        touches: any//DOMTouchList;
    }
    
    export interface UIEvent extends SyntheticEvent {
        detail: number;
        view: Window;
    }
    
    export interface WheelEvent {
        deltaX: number;
        deltaMode: number;
        deltaY: number;
        deltaZ: number;
    }
    
    interface ReactEvents {
        onCopy?: (event: ClipboardEvent) => void;
        onCut?: (event: ClipboardEvent) => void; 
        onPaste?: (event: ClipboardEvent) => void;
        
        onKeyDown?: (event: KeyboardEvent) => void; 
        onKeyPress?: (event: KeyboardEvent) => void; 
        onKeyUp?: (event: KeyboardEvent) => void;
    
        onFocus?: (event: FocusEvent) => void; 
        onBlur?: (event: FocusEvent) => void; 
    
        onChange?: (event: FormEvent) => void;  
        onInput?: (event: FormEvent) => void;   
        onSubmit?: (event: FormEvent) => void;  
    
        onClick?: (event: MouseEvent) => void; 
        onDoubleClick?: (event: MouseEvent) => void; 
        onDrag?: (event: MouseEvent) => void; 
        onDragEnd ?: (event: MouseEvent) => void;
        onDragEnter?: (event: MouseEvent) => void; 
        onDragExit?: (event: MouseEvent) => void;
        onDragLeave?: (event: MouseEvent) => void;
        onDragOver?: (event: MouseEvent) => void; 
        onDragStart?: (event: MouseEvent) => void; 
        onDrop?: (event: MouseEvent) => void; 
        onMouseDown?: (event: MouseEvent) => void; 
        onMouseEnter?: (event: MouseEvent) => void; 
        onMouseLeave?: (event: MouseEvent) => void;
        onMouseMove?: (event: MouseEvent) => void; 
        onMouseUp?: (event: MouseEvent) => void;
    
        onTouchCancel?: (event: TouchEvent) => void; 
        onTouchEnd?: (event: TouchEvent) => void;  
        onTouchMove?: (event: TouchEvent) => void;  
        onTouchStart?: (event: TouchEvent) => void; 
    
        onScroll?: (event: UIEvent) => void; 
    
        onWheel?: (event: WheelEvent) => void; 
    }
    
    interface ReactAttributes {
        key?: string;
        ref?: string;
    }
    
    
    interface HTMLGlobalAttributes extends ReactAttributes, ReactEvents {
        accessKey?: string;
        className?: string;
        contentEditable?: string;
        contextMenu?: string;
        dir?: string;
        draggable?: boolean;
        hidden?: boolean;
        id?: string;
        lang?: string;
        spellCheck?: boolean;
        role?: string;
        scrollLeft?: number;
        scrollTop?: number;
        style?: { [styleNam: string]: string };
        tabIndex?: number;
        title?: string;
        
        dangerouslySetInnerHTML?: {
            __html: string;
        };
    }
    
    interface FormAttributes extends HTMLGlobalAttributes { 
        accept?: string;
        action?: string;
        autoCapitalize?: string;
        autoComplete?: string;
        encType?: string;
        method?: string;
        name?: string;
        target?: string;
    }

    interface InputAttributes extends HTMLGlobalAttributes { 
        accept?: string;
        alt?: string;
        autoCapitalize?: string;
        autoComplete?: string;
        autoFocus?: boolean;
        checked?: any;
        disabled?: boolean;
        form?: string;
        height?: number;
        list?: string;
        max?: number;
        maxLength?: number;
        min?: number;
        multiple?: boolean;
        name?: string;
        pattern?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        size?: number;
        src?: string;
        step?: number;
        type?: string;
        value?: string;
        width?: number;
    }

    interface IframeAttributes extends HTMLGlobalAttributes { 
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        frameBorder?: number;
        height?: number;
        name?: string;
        src?: string;
        width?: number;
    }

    interface AppletAttributes extends HTMLGlobalAttributes { 
        alt?: string;
    }

    interface AreaAttributes extends HTMLGlobalAttributes { 
        alt?: string;
        href?: string;
        rel?: string;
        target?: string;
    }

    interface ImgAttributes extends HTMLGlobalAttributes { 
        alt?: string;
        height?: number;
        src?: string;
        width?: number;
    }

    interface ButtonAttributes extends HTMLGlobalAttributes { 
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        name?: string;
        type?: string;
        value?: string;
    }

    interface KeygenAttributes extends HTMLGlobalAttributes { 
        autoFocus?: boolean;
        form?: string;
        name?: string;
    }

    interface SelectAttributes extends HTMLGlobalAttributes { 
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        multiple?: boolean;
        name?: string;
        required?: boolean;
        size?: number;
    }

    interface TextareaAttributes extends HTMLGlobalAttributes { 
        autoFocus?: boolean;
        form?: string;
        maxLength?: string;
        name?: string;
        placeholder?: string;
        readOnly?: string;
        required?: boolean;
    }

    interface AudioAttributes extends HTMLGlobalAttributes { 
        autoPlay?: boolean;
        controls?: boolean;
        loop?: boolean;
        preload?: string;
        src?: string;
    }

    interface VideoAttributes extends HTMLGlobalAttributes { 
        autoPlay?: boolean;
        controls?: boolean;
        height?: number;
        loop?: boolean;
        poster?: string;
        preload?: string;
        src?: string;
        width?: number;
    }

    interface TableAttributes extends HTMLGlobalAttributes { 
        cellPadding?: number;
        cellSpacing?: number;
    }

    interface MetaAttributes extends HTMLGlobalAttributes { 
        charSet?: string;
        content?: string;
        httpEquiv?: string;
        name?: string;
    }

    interface ScriptAttributes extends HTMLGlobalAttributes { 
        charSet?: string;
        src?: string;
        type?: string;
    }

    interface CommandAttributes extends HTMLGlobalAttributes { 
        checked?: boolean;
        icon?: string;
        radioGroup?: string;
        type?: string;
    }

    interface TdAttributes extends HTMLGlobalAttributes { 
        colSpan?: number;
        rowSpan?: number;
    }

    interface ThAttributes extends HTMLGlobalAttributes { 
        colSpan?: number;
        rowSpan?: number;
    }

    interface ObjectAttributes extends HTMLGlobalAttributes { 
        data?: string;
        form?: string;
        height?: number;
        name?: string;
        type?: string;
        width?: number;
        wmode?: string;
    }

    interface DelAttributes extends HTMLGlobalAttributes { 
        dateTime?: Date;
    }

    interface InsAttributes extends HTMLGlobalAttributes { 
        dateTime?: Date;
    }

    interface TimeAttributes extends HTMLGlobalAttributes { 
        dateTime?: Date;
    }

    interface FieldsetAttributes extends HTMLGlobalAttributes { 
        form?: string;
        name?: string;
    }

    interface LabelAttributes extends HTMLGlobalAttributes { 
        form?: string;
        htmlFor?: string;
    }

    interface MeterAttributes extends HTMLGlobalAttributes { 
        form?: string;
        max?: number;
        min?: number;
        value?: number;
    }

    interface OutputAttributes extends HTMLGlobalAttributes { 
        form?: string;
        htmlFor?: string;
        name?: string;
    }

    interface ProgressAttributes extends HTMLGlobalAttributes { 
        form?: string;
        max?: number;
        value?: number;
    }

    interface CanvasAttributes extends HTMLGlobalAttributes { 
        height?: number;
        width?: number;
    }

    interface EmbedAttributes extends HTMLGlobalAttributes { 
        height?: number;
        src?: string;
        type?: string;
        width?: number;
    }

    interface AAttributes extends HTMLGlobalAttributes { 
        href?: string;
        rel?: string;
        target?: string;
    }

    interface BaseAttributes extends HTMLGlobalAttributes { 
        href?: string;
        target?: string;
    }

    interface LinkAttributes extends HTMLGlobalAttributes { 
        href?: string;
        rel?: string;
    }

    interface TrackAttributes extends HTMLGlobalAttributes { 
        label?: string;
        src?: string;
    }

    interface BgsoundAttributes extends HTMLGlobalAttributes { 
        loop?: boolean;
    }

    interface MarqueeAttributes extends HTMLGlobalAttributes { 
        loop?: boolean;
    }

    interface MapAttributes extends HTMLGlobalAttributes { 
        name?: string;
    }

    interface ParamAttributes extends HTMLGlobalAttributes { 
        name?: string;
        value?: string;
    }

    interface OptionAttributes extends HTMLGlobalAttributes { 
        selected?: boolean;
        value?: string;
    }

    interface SourceAttributes extends HTMLGlobalAttributes { 
        src?: string;
        type?: string;
    }

    interface StyleAttributes extends HTMLGlobalAttributes { 
        type?: string;
    }

    interface MenuAttributes extends HTMLGlobalAttributes { 
        type?: string;
    }

    interface LiAttributes extends HTMLGlobalAttributes { 
        value?: string;
    }
    
    interface SVGAttributes extends ReactAttributes, ReactEvents  {
        id?: string;
        cx?: number;
        cy?: number;
        d?: number;
        fill?: string;
        fx?: number;
        fy?: number;
        gradientTransform?: any;
        gradientUnits?: string;
        offset?: number;
        points?: any;
        r?: number;
        rx?: number;
        ry?: number;
        spreadMethod?: string;
        stopColor?: string;
        stopOpacity?: number;
        stroke?: string;
        strokeLinecap?: string;
        strokeWidth?: number;
        transform?: string;
        version?: number;
        viewBox?: any;
        x1?: number;
        x2?: number;
        x?: number;
        y1?: number;
        y2?: number;
        y?: number;
    }
  
    export var DOM: {
        
       
        
        a:  ReactComponentFactory <AAttributes, ReactComponent<AAttributes, void>>;


        abbr:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        address:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        area:  ReactComponentFactory <AreaAttributes, ReactComponent<AreaAttributes, void>>;
        
        
        article:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        aside:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        audio:  ReactComponentFactory <AudioAttributes, ReactComponent<AudioAttributes, void>>;
        
        
        b:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        base:  ReactComponentFactory <BaseAttributes, ReactComponent<BaseAttributes, void>>;
        
        
        bdi:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        bdo:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        big:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        blockquote:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        body:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        br:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        button:  ReactComponentFactory <ButtonAttributes, ReactComponent<ButtonAttributes, void>>;
        
        
        canvas:  ReactComponentFactory <CanvasAttributes, ReactComponent<CanvasAttributes, void>>;
        
        
        caption:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        cite:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        code:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        col:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        colgroup:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        data:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        datalist:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        dd:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        del:  ReactComponentFactory <DelAttributes, ReactComponent<DelAttributes, void>>;
        
        
        details:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        dfn:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        div:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        dl:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        dt:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        em:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        embed:  ReactComponentFactory <EmbedAttributes, ReactComponent<EmbedAttributes, void>>;
        
        
        fieldset:  ReactComponentFactory <FieldsetAttributes, ReactComponent<FieldsetAttributes, void>>;
        
        
        figcaption:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        figure:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        footer:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        form:  ReactComponentFactory <FormAttributes, ReactComponent<FormAttributes, void>>;
        
        
        h1:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        h2:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        h3:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        h4:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        h5:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        h6:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        head:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        header:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        hr:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        html:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        i:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        iframe:  ReactComponentFactory <IframeAttributes, ReactComponent<IframeAttributes, void>>;
        
        
        img:  ReactComponentFactory <ImgAttributes, ReactComponent<ImgAttributes, void>>;
        
        
        input:  ReactComponentFactory <InputAttributes, ReactComponent<InputAttributes, void>>;
        
        
        ins:  ReactComponentFactory <InsAttributes, ReactComponent<InsAttributes, void>>;
        
        
        kbd:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        keygen:  ReactComponentFactory <KeygenAttributes, ReactComponent<KeygenAttributes, void>>;
        
        
        label:  ReactComponentFactory <LabelAttributes, ReactComponent<LabelAttributes, void>>;
        
        
        legend:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        li:  ReactComponentFactory <LiAttributes, ReactComponent<LiAttributes, void>>;
        
        
        link:  ReactComponentFactory <LinkAttributes, ReactComponent<LinkAttributes, void>>;
        
        
        main:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        map:  ReactComponentFactory <MapAttributes, ReactComponent<MapAttributes, void>>;
        
        
        mark:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        menu:  ReactComponentFactory <MenuAttributes, ReactComponent<MenuAttributes, void>>;
        
        
        menuitem:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        meta:  ReactComponentFactory <MetaAttributes, ReactComponent<MetaAttributes, void>>;
        
        
        meter:  ReactComponentFactory <MeterAttributes, ReactComponent<MeterAttributes, void>>;
        
        
        nav:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        noscript:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        object:  ReactComponentFactory <ObjectAttributes, ReactComponent<ObjectAttributes, void>>;
        
        
        ol:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        optgroup:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        option:  ReactComponentFactory <OptionAttributes, ReactComponent<OptionAttributes, void>>;
        
        
        output:  ReactComponentFactory <OutputAttributes, ReactComponent<OutputAttributes, void>>;
        
        
        p:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        param:  ReactComponentFactory <ParamAttributes, ReactComponent<ParamAttributes, void>>;
        
        
        pre:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        progress:  ReactComponentFactory <ProgressAttributes, ReactComponent<ProgressAttributes, void>>;
        
        
        q:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        rp:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        rt:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        ruby:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        s:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        samp:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        script:  ReactComponentFactory <ScriptAttributes, ReactComponent<ScriptAttributes, void>>;
        
        
        section:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        select:  ReactComponentFactory <SelectAttributes, ReactComponent<SelectAttributes, void>>;
        
        
        small:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        source:  ReactComponentFactory <SourceAttributes, ReactComponent<SourceAttributes, void>>;
        
        
        span:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        strong:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        style:  ReactComponentFactory <StyleAttributes, ReactComponent<StyleAttributes, void>>;
        
        
        sub:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        summary:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        sup:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        table:  ReactComponentFactory <TableAttributes, ReactComponent<TableAttributes, void>>;
        
        
        tbody:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        td:  ReactComponentFactory <TdAttributes, ReactComponent<TdAttributes, void>>;
        
        
        textarea:  ReactComponentFactory <TextareaAttributes, ReactComponent<TextareaAttributes, void>>;
        
        
        tfoot:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        th:  ReactComponentFactory <ThAttributes, ReactComponent<ThAttributes, void>>;
        
        
        thead:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        time:  ReactComponentFactory <TimeAttributes, ReactComponent<TimeAttributes, void>>;
        
        
        title:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        tr:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        track:  ReactComponentFactory <TrackAttributes, ReactComponent<TrackAttributes, void>>;
        
        
        u:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        ul:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        var:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        video:  ReactComponentFactory <VideoAttributes, ReactComponent<VideoAttributes, void>>;
        
        
        wbr:  ReactComponentFactory <HTMLGlobalAttributes, ReactComponent<HTMLGlobalAttributes, void>>;
        
        
        //svg elements
        circle:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;


        g:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;
        
        
        line:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;
        
        
        path:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;
        
        
        polygon:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;
        
        
        polyline:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;
        
        
        rect:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;
        
        
        svg:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;
        
        
        text:  ReactComponentFactory <SVGAttributes, ReactComponent<SVGAttributes, void>>;
    
    }
    
}


declare module 'react' {
    export = React
}    
