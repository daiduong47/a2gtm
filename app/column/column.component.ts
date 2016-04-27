import {Component, Input, OnInit, AfterViewInit, ElementRef} from 'angular2/core';
import {Column} from './column';
import {Card} from '../card/card';
import {CardComponent} from '../card/card.component'
import {BoardService} from '../board/board.service';

declare var jQuery: any;

@Component({
    selector: 'gtm-column',
    templateUrl: 'app/column/column.component.html',
    styleUrls: ['app/column/column.component.css'],
    directives: [CardComponent]
})
export class ColumnComponent implements OnInit {
    @Input()
    column: Column;
    editingColumn = false;
    addingCard = false;
    addCardText: string;
    currentTitle: string;

    constructor(private el: ElementRef, private _boardService: BoardService) { }

    ngOnInit(){
   
    }

    ngAfterViewInit(){
      let component = this;
      jQuery('.card-list').sortable({
        connectWith: ".card-list",
        placeholder: "card-placeholder",
        dropOnEmpty: true,
        tolerance: 'pointer',
        start: function(event, ui) {
          ui.placeholder.height(ui.item.outerHeight());
        },
        stop: function(event, ui) {
          component.updateCardOrder(event, ui);
        }
      });
      jQuery('.card-list').disableSelection();     
    }

    updateCardOrder(event, ui){
        var senderColumnId = ui//.sender//.context.getAttribute('column-id');
        var targetColumnId = +ui.item.closest('.card-list').attr('column-id');
        var cardId = +ui.item.find('.card').attr('card-id');
        console.log(senderColumnId, targetColumnId, cardId);
    }

    blurOnEnter(event) {
        if (event.keyCode === 13){
            event.target.blur();
        }
    } 

    updateColumn() {
        if (this.column.title && this.column.title.trim() !== '') 
        {
            this._boardService.updateColumn(this.column);
            this.editingColumn = false;
        } else {
            this.column.title = this.currentTitle;
            this.editingColumn = false;
        }
    }

    editColumn() {
        this.currentTitle = this.column.title;
        this.editingColumn = true;
        let input = this.el.nativeElement
                        .getElementsByClassName('column-header')[0]
                        .getElementsByTagName('input')[0];

        setTimeout(function() { input.focus(); }, 0);
    }

    enableAddCard() {
        this.addingCard = true;
        let input = this.el.nativeElement
            .getElementsByClassName('add-card')[0]
            .getElementsByTagName('input')[0];

        setTimeout(function() { input.focus(); }, 0);
    }

    addCard(parent: Column) {
        if (this.addCardText && this.addCardText.trim() !== ''){
            let newCard = <Card>{ title: this.addCardText, order: parent.cards.length + 1, columnId: parent.id };
            parent.cards.push(newCard);
            this._boardService.addCard(newCard, this.column);
        }
        this.clearAddCard();
    }

    clearAddCard(){
        this.addingCard = false;
        this.addCardText = '';
    }
}