// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import lqip from 'src/modules/lqip';
import { setBookmarkFlag } from 'src/modules/bookmark';

setBookmarkFlag();
lqip();
