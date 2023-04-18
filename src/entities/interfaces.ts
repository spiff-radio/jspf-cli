import { Type } from 'class-transformer';
import {JspfAttributionI,JspfLinkI,JspfMetaI,JspfExtensionI,JspfPlaylistI,JspfTrackI} from '../entities/jspf/interfaces';
import {Track} from './models';

export interface TrackI extends JspfTrackI {}

export interface AttributionI extends JspfAttributionI {}

export interface LinkI extends JspfLinkI {}

export interface MetaI extends JspfMetaI {}

export interface ExtensionI extends JspfExtensionI {}

export interface PlaylistI extends JspfPlaylistI {}
